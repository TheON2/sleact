import React, {memo,useMemo, VFC} from "react";
import {IChat, IDM} from "@typings/db";
import {ChatWrapper} from "./styles";
import gravatar from "gravatar";
import dayjs from "dayjs";
import regexifyString from "regexify-string";
import { Link } from "react-router-dom";
import {useParams} from "react-router";

interface Props {
    data: (IDM | IChat);
}

const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com'
const Chat: VFC<Props> = ({data}) => {
    const { workspace } = useParams<{workspace : string; channel: string}>();

    const user = `Sender` in data ? data.Sender : data.User;

    // @[제로초1] (7)
    // \d 숫자 +는 1개이상 ?는 0개 or 1개 *는 0개이상
    // g는 모두찾기
    const result = useMemo(
        ()=>
        data.content.startsWith('uploads\\') ?
            (<img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200}}/> )
        :
            (regexifyString({
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        decorator(match, index) {
            const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
            if (arr) {
                return (
                    <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                        @{arr[1]}
                    </Link>
                );
            }
            return <br key={index} />;
        },
        input: data.content,
    })),[data.content]);

    return (
        <ChatWrapper>
            <div className="chat-img">
                <img src={gravatar.url(user.email, {s: '36px', d: 'retro'})} alt={user.nickname}/>
            </div>
            <div className="chat-text">
                <div className="chat-user">
                    <b>{user.nickname}</b>
                    <span>{dayjs(data.createdAt).format('h:mm A')}</span>
                </div>
            </div>
            <p>{data.content}</p>
        </ChatWrapper>
    );
};

export default memo(Chat);