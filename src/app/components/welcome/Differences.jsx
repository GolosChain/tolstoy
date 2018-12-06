import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

const Root = styled.section`
    padding: 20px 0;
`;

const Row = styled.div`
    min-height: 1200px;
`;

const MainHeader = styled.div`
    font-family: ${a => a.theme.fontFamilySerif};
    font-size: 36px;
    line-height: 1.06;
    letter-spacing: 0.6px;
    color: #333;
    margin-bottom: 60px;
`;

const Description = styled.div`
    font-family: 'Open Sans', 'sans-serif';
    font-size: 14px;
    line-height: 1.57;
    color: #9fa3a7;
`;

const Block = styled.div`
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    padding: 40px 60px;
    min-height: 460px;
    margin: 0.9375rem 0;

    @media screen and (max-width: 63.9375em) {
        min-height: 500px;
    }
    @media screen and (max-width: 39.9375em) {
        min-height: 400px;
    }
`;

const Image = styled.div`
    height: 70px;
`;

const Header = styled.div`
    font-family: ${a => a.theme.fontFamilySerif};
    font-size: 22px;
    line-height: 1.42;
    color: #212121;
    margin: 20px 0;
`;

const Button = styled.a`
    margin: 30px 0 0;
    padding: 0.85em 1.5em;
    letter-spacing: 3px;
`;

export default class Differences extends PureComponent {
    render() {
        const { differences } = this.props;

        return (
            <Root>
                <Row className="row align-middle">
                    <div className="columns">
                        <MainHeader>{tt('welcome_page.differences_title')}</MainHeader>
                        <div className="row small-up-1 medium-up-2 large-up-3">
                            {this.renderItems(differences)}
                        </div>
                    </div>
                </Row>
            </Root>
        );
    }

    renderItems(items) {
        return items.map(({ header, description, pic, url }, i) => (
            <div key={i} className="columns">
                <Block className="align-top align-justify flex-dir-column flex-container">
                    <div>
                        <Image>
                            <img src={`images/new/welcome/${pic}.svg`} />
                        </Image>
                        <Header>{header}</Header>
                        <Description>{description}</Description>
                    </div>
                    {url ? (
                        <Button
                            className="button small violet hollow"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {tt('welcome_page.differences_button')}
                        </Button>
                    ) : null}
                </Block>
            </div>
        ));
    }
}
