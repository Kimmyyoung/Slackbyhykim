import React, { CSSProperties, FC, useCallback } from "react";
import { CloseModalButton, CreateMenu } from "./style";

interface Props {
    show: boolean, 
    onCloseModal: ()=>void;
    style:CSSProperties;
    closeButton?: boolean;
}

const Menu :FC<Props> = ({ children, style, show, onCloseModal,closeButton }) => {
    const stopPropagation = useCallback((e)=>{
        e.stopPropagation();
    },[]);
    //나 자신외의 배경을 클릭 했을때 모달이 닫히게 하는 기능
    //이벤트 버블링이 안되는 것

    if(!show) return null;
    
    return ( 
        <CreateMenu onClick={onCloseModal}>
            <div style={style} onClick={stopPropagation}>
            {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
            {children}
            </div>
        </CreateMenu>
    )
};

Menu.defaultProps = {
    closeButton  : true,
};
//이 컴포넌트를 사용하는 페이지에서 따로 설정을 안해줘도 default 값은 true;

export default Menu;
