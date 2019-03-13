import React from 'react';
import styled from 'styled-components';
import { Form, Field } from 'react-final-form';
import tt from 'counterpart';

import { USER_GENDER } from 'constants/config';
import SplashLoader from 'golos-ui/SplashLoader';
import { CardContent } from 'golos-ui/Card';
import {
  FormGroup,
  FormGroupRow,
  Label,
  LabelRow,
  Input,
  Select,
  Textarea,
  FormError,
  FormFooter,
  FormFooterButton,
} from 'golos-ui/Form';
import Icon from 'golos-ui/Icon';

const LabelIcon = styled(LabelRow)`
  flex-basis: 28px;
  color: #393636;
`;

const UserName = styled.div`
  color: #363636;
`;

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || (value && validator(value)), undefined);

const isLengthGreaterThan = (min, err) => value => (value && value.length > min ? err : undefined);

const isStartWithAt = err => value => (/^\s*@/.test(value) ? err : undefined);

const isNotUrl = err => value => (!/^https?:\/\//.test(value) ? err : undefined);

const composedUrlValidator = value =>
  composeValidators(
    isLengthGreaterThan(100, tt('settings_jsx.website_url_is_too_long')),
    isNotUrl(tt('settings_jsx.invalid_url'))
  )(value);

const usernameValidation = (username, err) =>
  username && /^[a-zA-Z0-9\-\.]+$/.test(username) ? err : undefined;

const validate = values => ({
  name: composeValidators(
    isLengthGreaterThan(20, tt('settings_jsx.name_is_too_long')),
    isStartWithAt(tt('settings_jsx.name_must_not_begin_with'))
  )(values.name),
  about: isLengthGreaterThan(160, tt('settings_jsx.about_is_too_long'))(values.about),
  location: isLengthGreaterThan(160, tt('settings_jsx.location_is_too_long'))(values.location),
  website: composedUrlValidator(values.website),
  social: {
    facebook: usernameValidation(values.social ? values.social.facebook : false),
    vkontakte: usernameValidation(values.social ? values.social.vkontakte : false),
    instagram: usernameValidation(values.social ? values.social.instagram : false),
    twitter: usernameValidation(values.social ? values.social.twitter : false),
  },
});

const Account = ({ profile, account, onSubmitBlockchain }) => {
  profile.username = account.get('name'); // for disabled input, omitting from submit data

  return (
    <Form onSubmit={onSubmitBlockchain} initialValues={profile} validate={validate}>
      {({ handleSubmit, submitError, form, submitting, pristine, hasValidationErrors }) => (
        <form onSubmit={handleSubmit}>
          {submitting && <SplashLoader />}

          <CardContent column>
            <Field name="username">
              {({ input }) => (
                <FormGroupRow justify="space-between">
                  <LabelRow>{tt('settings_jsx.profile_username')}</LabelRow>
                  <UserName>@{input.value}</UserName>
                </FormGroupRow>
              )}
            </Field>
            <Field name="name">
              {({ input, meta }) => (
                <FormGroup>
                  <Label>{tt('settings_jsx.profile_name')}</Label>
                  <Input
                    {...input}
                    autocomplete="name"
                    type="text"
                    placeholder={tt('settings_jsx.account.placeholders.name')}
                  />
                  <FormError meta={meta} />
                </FormGroup>
              )}
            </Field>
            <Field name="gender">
              {({ input, meta }) => (
                <FormGroup>
                  <Label>{tt('settings_jsx.profile_gender.title')}</Label>
                  <Select {...input} placeholder={tt('settings_jsx.account.placeholders.gender')}>
                    {USER_GENDER.map(i => {
                      return (
                        <option key={i} value={i}>
                          {tt('settings_jsx.profile_gender.genders.' + i)}
                        </option>
                      );
                    })}
                  </Select>
                  <FormError meta={meta} />
                </FormGroup>
              )}
            </Field>
            {/* <Field name="email">
                          {({ input, meta }) => (
                              <FormGroup>
                                  <Label>{tt('settings_jsx.profile_email')}</Label>
                                  <Input
                                      {...input}
                                      autocomplete="email"
                                      type="text"
                                  />
                                  <FormError meta={meta} />
                              </FormGroup>
                          )}
                      </Field> */}
            <Field name="location">
              {({ input, meta }) => (
                <FormGroup>
                  <Label>{tt('settings_jsx.profile_location')}</Label>
                  <Input
                    {...input}
                    type="text"
                    placeholder={tt('settings_jsx.account.placeholders.location')}
                  />
                  <FormError meta={meta} />
                </FormGroup>
              )}
            </Field>
            <Field name="about">
              {({ input, meta }) => (
                <FormGroup>
                  <Label>{tt('settings_jsx.profile_about')}</Label>
                  <Textarea
                    {...input}
                    placeholder={tt('settings_jsx.account.placeholders.about')}
                    rows={6}
                  />
                  <FormError meta={meta} />
                </FormGroup>
              )}
            </Field>
            <Field name="website">
              {({ input, meta }) => (
                <FormGroup>
                  <Label>{tt('settings_jsx.profile_website')}</Label>
                  <Input
                    {...input}
                    type="text"
                    placeholder={tt('settings_jsx.account.placeholders.website')}
                  />
                  <FormError meta={meta} />
                </FormGroup>
              )}
            </Field>
            <FormGroup>
              <Label>{tt('settings_jsx.social_networks')}</Label>
              <Field name="social.facebook">
                {({ input, meta }) =>
                  renderSocialField(
                    tt('settings_jsx.account.placeholders.social_facebook'),
                    input,
                    meta,
                    {
                      name: 'facebook',
                      width: 13,
                      height: 24,
                    }
                  )
                }
              </Field>
              <Field name="social.vkontakte">
                {({ input, meta }) =>
                  renderSocialField(
                    tt('settings_jsx.account.placeholders.social_vkontakte'),
                    input,
                    meta,
                    {
                      name: 'vk',
                      width: 28,
                      height: 18,
                    }
                  )
                }
              </Field>
              <Field name="social.instagram">
                {({ input, meta }) =>
                  renderSocialField(
                    tt('settings_jsx.account.placeholders.social_instagram'),
                    input,
                    meta,
                    {
                      name: 'instagram',
                      size: 23,
                    }
                  )
                }
              </Field>
              <Field name="social.twitter">
                {({ input, meta }) =>
                  renderSocialField(
                    tt('settings_jsx.account.placeholders.social_twitter'),
                    input,
                    meta,
                    {
                      name: 'twitter',
                      width: 26,
                      height: 22,
                    }
                  )
                }
              </Field>
            </FormGroup>
            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}

            {submitError && <div>{submitError}</div>}
          </CardContent>
          <FormFooter>
            <FormFooterButton onClick={form.reset} disabled={submitting || pristine}>
              {tt('settings_jsx.reset')}
            </FormFooterButton>
            <FormFooterButton
              type="submit"
              primary
              disabled={submitting || pristine || hasValidationErrors}
            >
              {tt('settings_jsx.update')}
            </FormFooterButton>
          </FormFooter>
        </form>
      )}
    </Form>
  );
};

function renderSocialField(placeholder, input, meta, icon) {
  return (
    <FormGroupRow>
      <LabelIcon>
        <Icon {...icon} />
      </LabelIcon>
      <Input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...input}
        type="text"
        placeholder={placeholder}
        value={input.value.replace(' ', '').trim()}
      />
      <FormError meta={meta} />
    </FormGroupRow>
  );
}

export default Account;
