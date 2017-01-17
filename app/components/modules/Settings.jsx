import React from 'react';
import {connect} from 'react-redux'
import user from 'app/redux/User';
import { translate } from 'app/Translator';
import { ALLOWED_CURRENCIES } from 'config/client_config'
import store from 'store';
import transaction from 'app/redux/Transaction'
import o2j from 'shared/clash/object2json'
import _urls from 'shared/clash/images/urls'
import _btc from 'shared/clash/coins/btc'
import { injectIntl } from 'react-intl'

@injectIntl
class Settings extends React.Component {

    state = {
        errorMessage: '',
        successMessage: '',
 
        userImage: this.props.userImage || '',
        fullname: this.props.fullname || ''
    }

    handleCurrencyChange(event) { store.set('currency', event.target.value) }

    handleLanguageChange = (event) => {
        const language = event.target.value
        store.set('language', language)
        this.props.changeLanguage(language)
    }

    

    handleUrlChange = event => {
        this.setState({userImage: event.target.value})
    }

    


    handleUserImageSubmit = event => {
        event.preventDefault()
        this.setState({loading: true})

        const {account, updateAccount} = this.props
        let {metaData} = this.props

        if (!metaData) metaData = {}
        if (metaData == '{created_at: \'GENESIS\'}') metaData = {created_at: "GENESIS"}
        metaData.user_image = this.state.userImage
        metaData = JSON.stringify(metaData);

        updateAccount({
            json_metadata: metaData,
            account: account.name,
            memo_key: account.memo_key,
            errorCallback: err => {
                console.error('updateAccount() error!', err)
                this.setState({
                    loading: false,
                    errorMessage: translate('server_returned_error')
                })
            },
            successCallback: () => {
                console.log('SUCCES')
                // clear form ad show successMessage
                this.setState({
                    loading: false,
                    errorMessage: '',
                    successMessage: translate('saved') + '!',
                })
                // remove successMessage after a while
                setTimeout(() => this.setState({successMessage: ''}), 2000)
            }
        })
    }


    //HandleUsername

      handleUsernameChange = event => {
        this.setState({fullname: event.target.value})
    }


     handleUsernameSubmit = event => {
        event.preventDefault()
        this.setState({loading: true})

        const {account, updateAccount} = this.props
        let {metaData} = this.props

        if (!metaData) metaData = {}
        if (metaData == '{created_at: \'GENESIS\'}') metaData = {created_at: "GENESIS"}
        metaData.fullname = this.state.fullname;
        metaData = JSON.stringify(metaData);

        updateAccount({
            json_metadata: metaData,
            account: account.name,
            memo_key: account.memo_key,
            errorCallback: err => {
                console.error('updateAccount() error!', err)
                this.setState({
                    loading: false,
                    errorMessage: translate('server_returned_error')
                })
            },
            successCallback: () => {
                console.log('SUCCES')
                // clear form ad show successMessage
                this.setState({
                    loading: false,
                    errorMessage: '',
                    successMessage: translate('saved') + '!',
                })
                // remove successMessage after a while
                setTimeout(() => this.setState({successMessage: ''}), 2000)
            }
        })
    }

    render() {
        const {state, props} = this
        const {locale} = props.intl

        return <div className="Settings">
                    <div className="row">
                        <div className="small-12 medium-6 large-4 columns">

                       {/* CHOOSE USER NAME */}
                            <form onSubmit={this.handleUsernameSubmit}>
                                <label>{translate('username')}
                                    <input type="text" onChange={this.handleUsernameChange} value={state.fullname} />
                                    {
                                        state.errorMessage
                                        ? <small className="error">{state.errorMessage}</small>
                                        : state.successMessage
                                        ? <small className="success">{state.successMessage}</small>
                                        : null
                                    }
                                </label>
                                <p className="text-center" style={{marginTop: 16.8}}>
                                    <input type="submit" className="button" value={translate('save')} />
                                </p>
                               </form>
                           


                            {/* CHOOSE LANGUAGE */}
                            <label>{translate('choose_language')}
                              <select defaultValue={locale} onChange={this.handleLanguageChange}>
                                <option value="ru">русский</option>
                                <option value="en">english</option>
                                {/* in react-intl they use 'uk' instead of 'ua' */}
                                <option value="uk">українська</option>
                              </select>
                            </label>
                            {/* CHOOSE CURRENCY */}
                            <label>{translate('choose_currency')}
                                <select defaultValue={store.get('currency')} onChange={this.handleCurrencyChange}>
                                    {
                                        ALLOWED_CURRENCIES.map(i => {
                                            return <option key={i} value={i}>{i}</option>
                                        })
                                    }
                                </select>
                            </label>
                            {/* CHOOSE USER IMAGE */}
                            <form onSubmit={this.handleUserImageSubmit}>
                                <label>{translate('add_image_url')}
                                    <input type="url" onChange={this.handleUrlChange} value={state.userImage} disabled={!props.isOwnAccount || state.loading} />
                                    {
                                        state.errorMessage
                                        ? <small className="error">{state.errorMessage}</small>
                                        : state.successMessage
                                        ? <small className="success">{state.successMessage}</small>
                                        : null
                                    }
                                </label>
                                <p className="text-center" style={{marginTop: 16.8}}>
                                    <input type="submit" className="button" value={translate('save_avatar')} />
                                </p>
                            </form>
                        </div>
                        <div className="small-12 medium-6 large-8 columns text-center">
                            {
                                state.userImage
                                ? <img src={_urls.proxyImage(state.userImage)} alt={translate('user_avatar') + ' ' + props.account.name} />
                                : null
                            }
                        </div>
                    </div>
                </div>
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const {accountname} = 	ownProps.routeParams
        const account 		= 	state.global.getIn(['accounts', accountname]).toJS()
        const current_user 	= 	state.user.get('current')
        const username 		=	current_user ? current_user.get('username') : ''
        const metaData 		=	account ? o2j.ifStringParseJSON(account.json_metadata) : {}
        const userImage     =   metaData ? metaData.user_image : ''
        const fullname     =   metaData ? metaData.fullname : ''

        return {
            account,
            metaData,
            userImage,
            fullname,
            isOwnAccount: username == accountname,
            ...ownProps
        }
    },
    // mapDispatchToProps
    dispatch => ({
        changeLanguage: (language) => {
            dispatch(user.actions.changeLanguage(language))
        },
        updateAccount: ({successCallback, errorCallback, ...operation}) => {
			const options = {type: 'account_update', operation, successCallback, errorCallback}
			dispatch(transaction.actions.broadcastOperation(options))
        }
    })
)(Settings)
