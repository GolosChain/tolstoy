import styled from 'styled-components';

export const PostTitle = styled.div`
    font-size: 20px;
    font-family: ${({ theme }) => theme.fontFamilySerif};
    color: #212121;
    line-height: 29px;
    margin-bottom: 8px;
`;

export const PostBody = styled.div`
    font-family: ${({ theme }) => theme.fontFamily};
    color: #959595;
`;
