import koa_router from 'koa-router';
import koa_body from 'koa-body';
import config from 'config';
import { rateLimitReq, checkCSRF } from 'server/utils/misc';
import coBody from 'co-body';
import Tarantool from 'db/tarantool';
import { PublicKey, Signature, hash } from 'golos-js/lib/auth/ecc';
import { api } from 'golos-js';

export default function useGeneralApi(app) {
    const router = koa_router({ prefix: '/api/v1' });
    app.use(router.routes());
    const koaBody = koa_body();

    router.get('/healthcheck', function*() {
        this.status = 200;
        this.statusText = 'OK';
        this.body = { status: 200, statusText: 'OK' };
    });

    router.post('/login_account', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const { csrf, account, signatures } =
            typeof params === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, csrf)) return;
        console.log('-- /login_account -->', this.session.uid, account);
        try {
            let body = { status: 'ok' };
            if (signatures) {
                if (!this.session.login_challenge) {
                    console.error('/login_account missing this.session.login_challenge');
                } else {
                    const [chainAccount] = yield api.getAccountsAsync([account]);
                    if (!chainAccount) {
                        console.error('/login_account missing blockchain account', account);
                    } else {
                        const auth = { posting: false };
                        const bufSha = hash.sha256(
                            JSON.stringify({ token: this.session.login_challenge }, null, 0)
                        );
                        const verify = (type, sigHex, pubkey, weight, weight_threshold) => {
                            if (!sigHex) return;
                            if (weight !== 1 || weight_threshold !== 1) {
                                console.error(
                                    `/login_account login_challenge unsupported ${type} auth configuration: ${account}`
                                );
                            } else {
                                const sig = parseSig(sigHex);
                                const public_key = PublicKey.fromString(pubkey);
                                const verified = sig.verifyHash(bufSha, public_key);
                                if (!verified) {
                                    console.error(
                                        '/login_account verification failed',
                                        this.session.uid,
                                        account,
                                        pubkey
                                    );
                                }
                                auth[type] = verified;
                            }
                        };
                        const {
                            posting: {
                                key_auths: [[posting_pubkey, weight]],
                                weight_threshold,
                            },
                        } = chainAccount;
                        verify(
                            'posting',
                            signatures.posting,
                            posting_pubkey,
                            weight,
                            weight_threshold
                        );
                        if (auth.posting) {
                            this.session.a = account;
                            if (config.has('tarantool') && config.has('tarantool.host')) {
                                try {
                                    const res = yield Tarantool.instance('tarantool').call(
                                        'get_guid',
                                        account
                                    );
                                    const [acc, guid] = res[0][0];
                                    body = Object.assign(body, { guid });
                                } catch (e) {}
                            }
                        }
                    }
                }
            }

            this.body = JSON.stringify(body);
        } catch (error) {
            console.error('Error in /login_account api call', this.session.uid, error.message);
            this.body = JSON.stringify({ error: error.message });
            this.status = 500;
        }
    });

    router.post('/logout_account', koaBody, function*() {
        // if (rateLimitReq(this, this.req)) return; - logout maybe immediately followed with login_attempt event
        const params = this.request.body;
        const { csrf } = typeof params === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, csrf)) return;
        console.log('-- /logout_account -->', this.session.uid);
        try {
            this.session.a = this.session.user = this.session.uid = null;
            this.body = JSON.stringify({ status: 'ok' });
        } catch (error) {
            console.error('Error in /logout_account api call', this.session.uid, error);
            this.body = JSON.stringify({ error: error.message });
            this.status = 500;
        }
    });

    router.post('/csp_violation', function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = yield coBody.json(this);
        console.log('-- /csp_violation -->', this.req.headers['user-agent'], params);
        this.body = '';
    });
}

const parseSig = hexSig => {
    try {
        return Signature.fromHex(hexSig);
    } catch (e) {
        return null;
    }
};
