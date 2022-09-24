import React, {useCallback, VFC, useRef, useEffect} from "react";
import {MentionsTextarea, Form, ChatArea, Toolbox, SendButton, EachMention} from "@components/ChatBox/styles";
import {Mention, SuggestionDataItem} from "react-mentions";
import autosize from "autosize";
import {useParams} from "react-router";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import {IUserWithOnline} from "@typings/db";
import gravatar from "gravatar";

interface Props {
    chat: string;
    onSubmitForm: (e: any) => void;
    onChangeChat: (e: any) => void;
    placeholder?: string;
}

const ChatBox: VFC<Props> = ({chat, onSubmitForm, onChangeChat, placeholder}) => {

    const {workspace, id} = useParams<{ workspace: string, id: string }>();
    const {
        data: userData,
        error,
        mutate
    } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher, {dedupingInterval: 2000,},);
    const {data: memberData} = useSWR<IUserWithOnline[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher,);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const renderUserSuggestion = useCallback(
        (
             suggestion: SuggestionDataItem,
             search: string,
             highlightedDisplay: React.ReactNode,
             index: number,
             focus: boolean,
        ): React.ReactNode => {
            if(!memberData) return;
            return(
                <EachMention focus={focus}>
                    <img src={gravatar.url(memberData[index].email, { s: '20px' , d: 'retro'})} alt={memberData[index].nickname}/>
                    <span>{highlightedDisplay}</span>
                </EachMention>
            )
        }, [memberData]);

    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }
    }, []);

    const onKeydownChat = useCallback((e) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();
                onSubmitForm(e);
            }
        }
    }, [onSubmitForm]);

    return (
        <ChatArea>
            <Form onSubmit={onSubmitForm}>
                <MentionsTextarea
                    id="editor-chat"
                    value={chat}
                    onChange={onChangeChat}
                    onKeyPress={onKeydownChat}
                    placeholder={placeholder}
                    inputRef={textareaRef}
                    allowSuggestionsAboveCursor
                >
                    <Mention
                        appendSpaceOnAdd
                        trigger="@"
                        data={memberData?.map((v) => ({id: v.id, display: v.nickname})) || []}
                        renderSuggestion={renderUserSuggestion}
                    />
                </MentionsTextarea>
                <Toolbox>
                    <SendButton
                        className={
                            'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
                            (chat?.trim() ? '' : ' c-texty_input__button--disabled')
                        }
                        data-qa="texty_send_button"
                        aria-label="Send message"
                        data-sk="tooltip_parent"
                        type="submit"
                        disabled={!chat?.trim()}
                    >
                        <i className="c-icon c-icon--paperplane-filled" aria-hidden="true"/>
                    </SendButton>
                </Toolbox>
            </Form>
        </ChatArea>
    )


};

export default ChatBox;