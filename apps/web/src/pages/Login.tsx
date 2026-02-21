import { ChangeEvent, FC, SetStateAction, useState } from 'react';
import { gql } from '#gql';
import { useMutation } from '@apollo/client';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import Card from '../components/Card';
import Section from '../components/Section';
import Title from '../components/Title';
import Input from '../components/Input';
import Button from '../components/Button';
import AnimatedBackground from '../components/AnimatedBackground';

import styles from './styles/Login.scss';

const messages = defineMessages({
  password: { id: 'Login.password', defaultMessage: 'Password' },
  username: { id: 'Login.username', defaultMessage: 'Username' },
});

const LOGIN_MUTATION = gql(`
  mutation Login($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      id
      username
      role
    }
  }
`);

const Login: FC = () => {
  const intl = useIntl();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation(LOGIN_MUTATION, {
    errorPolicy: 'all',
  });

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement>,
    setState: (value: SetStateAction<string>) => void,
  ) => {
    const value = event.target.value;
    setState(value);
  };

  const isSubmitDisabled = !username.trim() || !password.trim();

  return (
    <>
      <Section
        backgroundColor="primary-gradient-color"
        gradient="secondary-accent-color"
        style="flex grow place-content-center"
        showAnimatedBackground
        center
      >
        <Card
          borderRadius={30}
          borderColor="primary-bg-color"
          backgroundColor="primary-bg-color"
        >
          <Section style="m-4" center>
            <div className={styles.loginWrapper}>
              <div className="flex">
                <Title fontFamily="Gugi" size="large" noMargin>
                  <FormattedMessage id="Login.login" defaultMessage="Login" />
                </Title>
              </div>
              <div className="center flex flex-col my-4">
                <Input
                  placeholder={intl.formatMessage(messages.username)}
                  icon="user"
                  value={username}
                  handleOnChange={(event) =>
                    handleTextChange(event, setUsername)
                  }
                />
                <Input
                  placeholder={intl.formatMessage(messages.password)}
                  icon="password"
                  password
                  value={password}
                  handleOnChange={(event) =>
                    handleTextChange(event, setPassword)
                  }
                  handleEnterPress={
                    isSubmitDisabled
                      ? undefined
                      : () => login({ variables: { username, password } })
                  }
                />
              </div>
              <div className="ml-auto flex flex-col">
                <Button
                  handleClick={() =>
                    login({ variables: { username, password } })
                  }
                  disabled={isSubmitDisabled}
                  right
                >
                  <Title size="small">
                    <FormattedMessage
                      id="Login.signIn"
                      defaultMessage="Sign In"
                    />
                  </Title>
                </Button>
              </div>
            </div>
          </Section>
        </Card>
      </Section>
      <AnimatedBackground />
    </>
  );
};

export default Login;
