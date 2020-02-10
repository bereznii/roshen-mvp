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
        <section class="login" id="login" style="display: none;" hidden>
            <h1 class="login__title">Вхід</h1>
            <form class="login__form" action="/admin/statistics" method="POST" id="login-form">
                <div class="login__fields">
                    <label class="label label--login login__label">
                        <span class="label__text">Логін</span>
                        <span class="input-wrapper input-wrapper--login">
                            <input class="input" type="text" name="login" placeholder="" maxlength="250" required>
                        </span>
                    </label>
                    <label class="label label--password login__label">
                        <span class="label__text">Пароль</span>
                        <span class="input-wrapper input-wrapper--password">
                            <input class="input" type="password" name="password" placeholder="" maxlength="250" required>
                        </span>
                    </label>
                    <label class="checkbox checkbox--line">
                        <input class="checkbox__input" type="checkbox" checked>
                        <span class="checkbox__mark"></span>
                        <span class="checkbox__content">Запам’ятати мене</span>
                    </label>
                </div>
                <button class="button" type="submit">Зайти</button>
            </form>
        </section>
        <section class="stats-controls" id="stats-controls" style="display: none;" hidden>
            <form class="stats-controls__form" action="" method="POST">
                <div class="stats-controls__fields">
                    <label class="label"><span class="label__text">Статистика товару</span>
                        <select class="select" id="select-products" name="product" required>
                            {{-- <option value="" disabled hidden selected>Оберіть товар</option> --}}
                            <option value="1" selected>Candy Nut</option>
                            <option value="2">Барбариска</option>
                            <option value="3">Коровка</option>
                            <option value="4">РОШЕН 56%</option>
                            <option value="5">РОШЕН 70%</option>
                            <option value="6">Моментс</option>
                        </select>
                    </label>
                    <label class="label">
                        <span class="label__text">Дата</span>
                        <span class="input-wrapper input-wrapper--date">
                            <input class="input" id="stats-date" type="text" name="date" placeholder="Оберіть дату, або перiод " maxlength="250">
                        </span>
                    </label>
                </div>
            </form>
        </section>
        <section class="stats-data" id="stats-data" style="display: none;" hidden>
        </section>
        <section class="info info--warning" id="error" style="display: none;" hidden>
            <div class="info__content">
                <img class="info__image" src="/img/warning.png" srcset="/img/warning@2x.png 2x, /img/warning.png 1x" alt="">
                <p class="info__description">Сталася помилка</p>
            </div>
        </section>
        <script src="/js/admin.min.js" defer></script>
    </body>
</html>
