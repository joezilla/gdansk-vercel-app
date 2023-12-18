import { I18N } from "./i18n";


import { log} from 'next-axiom'
afterEach(async() => {
    log.flush();
 });

// turn off logging, it's async and messes with the tests
process.env.AXIOM_LOG_LEVEL = "off";

test('test1', async () => {
    const i18n =  new I18N("de");
    await i18n.init();
    const t = i18n.getTranslator();
    let xlated =  t('test.foo');
    expect(xlated).toBe("DE-bar");    
});

test('test2', async () => {
    const i18n =  new I18N("en-US");
    await i18n.init();
    const t = i18n.getTranslator();    let xlated =  t('test.foo');
    expect(xlated).toBe("US-bar");    
});

test('testFallback', async () => {
    const i18n =  new I18N("de");
    await i18n.init();
    const t = i18n.getTranslator();    let xlated =  t('test.fallback');
    expect(xlated).toBe("US-fallback");    
});

test('testParams', async () => {
    const i18n =  new I18N("en-US");
    await i18n.init();
    const t = i18n.getTranslator();    let xlated =  t('test.baz', { "param1": "p1", "param2": "p2"});
    expect(xlated).toBe("US-bang p1, p2");    
});

