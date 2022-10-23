import PageParserBase from "./PageParserBase.mjs";

export default class Vicecom extends PageParserBase {
	static name =  'VICE';
	static domainMatcher = [
		'vice.com'
	];
	selectorsToRemove = [
		'.article__header__datebar',
		'.short-form__lede-credit',
		'[data-component="RelatedArticleBlock"]',
		'.article__tagged',
		'.user-newsletter-signup, .article-newsletter-signup, .user-newsletter',
	];
}
