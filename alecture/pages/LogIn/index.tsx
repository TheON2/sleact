import useInput from '@hooks/useInput';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
    const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            setLogInError(false);
            axios
                .post(
                    'http://localhost:3095/api/users/login',
                    { email, password },
                    {
                        withCredentials: true,
                    },
                )
                .then((response) => {
                    //revalidate();   // swr의 주기적인 요청으로 인한 백서버 트래픽을 방지하기 위함
                    mutate(response.data,false);
                    //mutate로 then처리를 하면 서버에 요청을 보내기전 클라이언트가 우선적으로 작업을 처리하고
                    //이후 서버에 신호를 보낸다 . 이를 OPTIMISTIC UI 라고 한다.
                    //shouldRevalidate 옵션을 false로 돌리면 클라이언트만 작동하고 서버에 신호는 안보낸다.
                })
                .catch((error) => {
                    setLogInError(error.response?.data?.statusCode === 401);
                });
        },
        [email, password],
    );

    if (data === undefined) {
        return <div>로딩중...</div>;
    }

    if (data) {
        return <Redirect to="/workspace/sleact/channel/일반" />;
    }

    // console.log(error, userData);
    // if (!error && userData) {
    //   console.log('로그인됨', userData);
    //   return <Redirect to="/workspace/sleact/channel/일반" />;
    // }

    return (
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                    </div>
                    {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
                </Label>
                <Button type="submit">로그인</Button>
            </Form>
            <LinkContainer>
                아직 회원이 아니신가요?&nbsp;
                <Link to="/signup">회원가입 하러가기</Link>
            </LinkContainer>
        </div>
    );
};

export default LogIn;
