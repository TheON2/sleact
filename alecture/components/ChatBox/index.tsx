import React, {useCallback, VFC, useRef, useEffect} from "react";
import {MentionsTextarea, Form, ChatArea, Toolbox, SendButton} from "@components/ChatBox/styles";
import {Mention} from "react-mentions";
import autosize from "autosize";

interface Props {
    chat: string;
    onSubmitForm: (e: any) => void;
    onChangeChat: (e: any) => void;
    placeholder?: string;
}

const ChatBox : VFC<Props> = ({chat,onSubmitForm,onChangeChat,placeholder}) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current){
            autosize(textareaRef.current);
        }
    }, []);


    const onKeydownChat=useCallback((e)=>{
        if(e.key === 'Enter'){
            if(!e.shiftKey)
            {
                e.preventDefault();
                onSubmitForm(e);
            }
        }
    },[onSubmitForm]);

    return(
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
                        data={data?.map((v) => ({ id: v.id, display: v.nickname })) || []}
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
                        <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
                    </SendButton>
                </Toolbox>
            </Form>
        </ChatArea>
    )


};

export default ChatBox;