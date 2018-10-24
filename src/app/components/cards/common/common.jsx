import styled from 'styled-components';

export const PostTitle = styled.div`
    margin-bottom: 8px;
    line-height: 29px;
    font-family: ${({ theme }) => theme.fontFamilySerif};
    font-size: 22px;
    color: #212121;

    @media (max-width: 600px) {
        font-size: 24px;
        font-weight: 700;
    }
`;

export const PostBody = styled.div`
    font-size: 16px;
    color: #959595;
    overflow: hidden;
    word-wrap: break-word;
`;
