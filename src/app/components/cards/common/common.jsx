import styled from 'styled-components';
import is from 'styled-is';

export const EntryWrapper = styled.div`
    margin-bottom: 16px;

    ${is('grid')`
        display: flex;
        flex-direction: column;
        flex-basis: 317px;
        flex-grow: 1;
        max-width: 50%;
        margin: 0 8px 16px;
        vertical-align: top;
        
        @media (max-width: 950px) {
            max-width: 100%;
        }
    `};
`;

export const PostTitle = styled.h3`
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 36.4px;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    color: #343434;
    max-width: 100%;

    @media (max-width: 900px) {
        font-size: 1.4375rem;
        line-height: 32.4px;
    }
`;

export const PostContent = styled.div`
    font-size: 1rem;
    line-height: 1.56;
    color: #333;
    overflow: hidden;
    word-wrap: break-word;
`;
