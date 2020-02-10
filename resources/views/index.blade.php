<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Cache-Control" content="public">
        <meta http-equiv="x-dns-prefetch-control" content="on">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Roshen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="keywords" content="">
        <meta name="robots" content="index, follow">
        <link rel="stylesheet" type="text/css" href="/css/index.min.css">
    </head>
    <body>
        <header class="header">
            <div class="header__content">
                <a class="header__link" href="/">
                    <img class="header__logo" src="/img/logo.png" srcset="/img/logo@2x.png 2x, /img/logo.png 1x" alt="Logo">
                </a>
            </div>
        </header>
        <section class="index" id="index" style="display: none;" hidden>
            <ul class="index__list">
                <li class="index__item"><a class="button" href="/product/1">1</a></li>
                <li class="index__item"><a class="button" href="/product/2">2</a></li>
                <li class="index__item"><a class="button" href="/product/3">3</a></li>
                <li class="index__item"><a class="button" href="/product/4">4</a></li>
                <li class="index__item"><a class="button" href="/product/5">5</a></li>
                <li class="index__item"><a class="button" href="/product/6">6</a></li>
                <li class="index__item">
                    <a href="/admin" class="button">Admin</a>
                </li>
                <li class="index__item" style="margin-top: 100px;">
                    <button type="button" onclick="window.localStorage.clear()" class="button">Reset</button>
                </li>
            </ul>
            <style>
                .index__list {
                    box-sizing: border-box;
                    list-style-type: none;
                    text-align: left;
                    margin: 0 auto;
                    padding: 15px 0;
                    width: 100%;
                    max-width: 280px;
                }
                .index__item {
                    box-sizing: border-box;
                    margin: 0 0 30px 0;
                    padding: 0 0;
                }
            </style>
        </section>
        <section class="estimate" id="estimate" style="display: none;" hidden>
        </section>
        <section class="info info--success" id="success" style="display: none;" hidden>
            <div class="info__content">
                <img class="info__image" src="/img/success.png" srcset="/img/success@2x.png 2x, /img/success.png 1x" alt="">
                <p class="info__description">Ваш голос прийнято!</p>
            </div>
        </section>
        <section class="info info--warning" id="error" style="display: none;" hidden>
            <div class="info__content">
                <img class="info__image" src="/img/warning.png" srcset="/img/warning@2x.png 2x, /img/warning.png 1x" alt="">
                <p class="info__description">Дякуємо, але...</p>
                <p class="info__description">Ви вже голосували</p>
            </div>
        </section>
        <section class="contact" id="contact" style="display: none;" hidden>
            <div class="contact__content">
                <h3 class="contact__title">Залишайтесь з нами та слідкуйте за новинами!</h3>
                <ul class="contact__list">
                    <li class="contact__item"><a class="button button--telegram" href="#">Ми в Telegram</a></li>
                    <li class="contact__item"><a class="button button--viber" href="#">Ми в Viber</a></li>
                    <li class="contact__item"><a class="button button--website" href="#">Наш сайт</a></li>
                </ul>
            </div>
        </section>
        <script src="/js/index.min.js" defer></script>
    </body>
</html>
