# Проект "Список дел"

## Технологии, на которых построен проект:

-   NestJS
-   React
-   TypeScript
-   Redux
-   PostgreSQL

## Как запустить проект:

1. Вытигиваем репозиторий через Git
2. Создаём БД postgres и, создав файл **.dev.env** в папке **server**, прописываем конфиг на бэкенде в .env файле (для примера есть файл [.example.env](./server/.example.env))
3. Запускаем бэкенд сервер:
    - Переходим в терминале в папку **server** и запускаем
    ```bash
    npm run start:dev
    ```
    Если всё прошло успешно, в консоли появится надпись:
    ```
    Server started on port: 5000
    ```
4. Запускаем фронтенд:

    - Переходим в терминале в папку **client** и запускаем

    ```bash
    npm run dev
    ```

    Если всё прошло успешно, в консоли появится надпись:

    ```
    VITE v4.3.9 ready in 11284 ms

    	➜ Local: http://localhost:5173/
    	➜ Network: use --host to expose
    	➜ press h to show help\*

    ```
5. Заходим на http://localhost:5173/
6. Profit!