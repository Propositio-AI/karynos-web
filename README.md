# karynos-web

[システム設計](https://www.notion.so/Karynos-web-module-1b39a9038f3880ddabdcd72c1f39f05f?source=copy_link)

## フォルダ構成

```cmd
├───public
└───src
    ├───app
    │   └───(routes)
    │       ├───job
    │       │   ├───detail
    │       │   │   └───[job_id]
    │       │   ├───match
    │       │   └───search
    │       ├───login
    │       │   ├───dreamer
    │       │   └───mentor
    │       └───mentor
    │           └───dreamer
    │               ├───detail
    │               │   └───[dreamer_id]
    │               ├───group
    │               │   ├───detail
    │               │   │   └───[group_id]
    │               │   └───new
    │               └───new
    ├───components
    │   ├───common
    │   ├───features
    │   │   ├───job
    │   │   ├───login
    │   │   └───mentor
    │   └───ui
    │       ├───atoms
    │       ├───molecules
    │       └───templates
    ├───hooks
    ├───lib
    │   └───api-client
    ├───store
    └───types
        ├───api
        └───ui
            ├───atoms
            ├───molecules
            └───templates
```

## 環境構築方法

```cmd
git clone https://github.com/Propositio-AI/karynos-web.git
cd karynos-web
npm install 
```

## 起動方法

```cmd
npm run dev
```

## 整形

```

```