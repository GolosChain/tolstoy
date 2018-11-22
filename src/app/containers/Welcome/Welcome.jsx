import React, { Component } from 'react';
import tt from 'counterpart';

import Hero from 'src/app/components/welcome/Hero';
import About from 'src/app/components/welcome/About';
import Initial from 'src/app/components/welcome/Initial';
import Differences from 'src/app/components/welcome/Differences';
import Mobile from 'src/app/components/welcome/Mobile';
import Reviews from 'src/app/components/welcome/Reviews';
import Questions from 'src/app/components/welcome/Questions';

const CATEGORY_NUMBER = 3;

export class Welcome extends Component {
    state = {
        tagsLoading: false,
        tagsActiveId: false,
        tagsCards: {},
        questionsLoading: false,
        questionsCards: [],
    };

    locale = tt.getLocale();

    tagsByLocale = locale => {
        if (locale === 'en') {
            return require('./tags_EN.json');
        } else if (locale === 'ru') {
            return require('./tags_RU.json');
        } else if (locale === 'uk') {
            return require('./tags_UA.json');
        }
    };

    differencesByLocale = locale => {
        if (locale === 'en') {
            return require('./differences_EN.json');
        } else if (locale === 'ru') {
            return require('./differences_RU.json');
        } else if (locale === 'uk') {
            return require('./differences_UA.json');
        }
    };

    slides = require('./slides.json');
    tags = this.tagsByLocale(this.locale);
    questions = require('./questions.json');
    differences = this.differencesByLocale(this.locale);

    async componentDidMount() {
        const { loadFavorites, getContent, getAccount } = this.props;

        this.fetchTagContents(this.tags[CATEGORY_NUMBER]);
        loadFavorites();

        // questions posts
        this.setState({ questionsLoading: true });

        try {
            const posts = await Promise.all(
                this.questions.map(item =>
                    getContent({
                        author: item.author,
                        permlink: item.permlink,
                    })
                )
            );

            await getAccount({
                usernames: posts.map(post => post.author),
            });

            this.setState({
                questionsLoading: false,
                questionsCards: posts,
            });
        } catch (err) {
            this.setState({ questionsLoading: false });
        }
    }

    fetchTagContents = async tag => {
        // if tag's posts already cached
        if (this.state.tagsCards[tag.id]) {
            this.setState({ tagsActiveId: tag.id });
            return;
        }

        this.setState({
            tagsLoading: true,
            tagsActiveId: false,
        });

        try {
            const posts = await Promise.all(
                tag.items.map(item =>
                    this.props.getContent({
                        author: item.author,
                        permlink: item.permlink,
                    })
                )
            );

            await this.props.getAccount({
                usernames: posts.map(post => post.author),
            });

            this.setState({
                tagsLoading: false,
                tagsActiveId: tag.id,
                tagsCards: {
                    ...this.state.tagsCards,
                    [tag.id]: posts,
                },
            });
        } catch (err) {
            this.setState({ tagsLoading: false, tagsActiveId: false });
        }
    };

    render() {
        const {
            tagsLoading,
            tagsActiveId,
            tagsCards,
            questionsLoading,
            questionsCards,
        } = this.state;

        return (
            <div>
                <Hero />
                <About />
                <Initial
                    tags={this.tags}
                    tagsLoading={tagsLoading}
                    tagsActiveId={tagsActiveId}
                    tagsCards={tagsCards}
                    fetchTagContents={this.fetchTagContents}
                />
                <Differences differences={this.differences} />
                <Mobile />
                <Reviews slides={this.slides} />
                <Questions questionsLoading={questionsLoading} questionsCards={questionsCards} />
            </div>
        );
    }
}
