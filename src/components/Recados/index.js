import styled from 'styled-components';
import Box from '../Box';

export const RecadosBoxWrapper = styled(Box)`
    
    ul {
            display: flex;
            flex-direction: column;
            height: auto;
            list-style: none;
    } 
    img {
        object-fit: cover;
        background-position: center center;
        width: 100%;
        height: 100%;
        position: relative;
    } 
    li {
        display: flex;
        padding: 10px 0;
    }

    div {
        padding-left: 10px;
    }
    a {
        display: inline-block;
        height: 102px;
        position: relative;
        overflow: hidden;
        border-radius: 90px;
        span {
            color: #DCDCDC;
            opacity: 95%;
            padding: 14px 16px;
            font-size: 10px;
            position: absolute;
            left: 0;
            bottom: 10px;
            z-index: 2;
            padding: 0 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
    }
    &:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-indeX: 1;
        background-image: linear-gradient(0deg,#00000073,transparent);
    }
    }
`;