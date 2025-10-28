# API Client Libary

## API Client Libaryとは

主にHTTPリクエストを送るためのライブラリです。
認証等の処理も内包実装を行う予定ですが，まだ未実装です．(2025/10/28)

## リクエスト例

本ライブラリを使用してリクエストを送る際には下記の引数を設定する必要があります．

| 引数名 |           概要             | 備考 |
|-------|----------------------------|------|
| TSend | リクエストボディのスキーマ | 必須 |
| TReceive | レスポンスボディのスキーマ | 必須 |
| method | リクエストメソッド | 必須 |
| url | ドメイン以下のURL | 必須 |
| config | 実際にボディのデータ（リクエストスキーマに準ずる必要あり） |  |
| onSuccess | リクエストが正常に処理された場合 |  |
| onError | リクエスト処理にエラーが発生した場合 |  |


```python
const APIcall = async <TSend, TReceive>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,    
    config?: ApiConfig<TSend>,
    onSuccess?: (data: TReceive) => Promise<void> | null,
    onError?: (code: string, message: string) => Promise<void>,
)   
````

下記にリクエスト例を示します．

```python
await API_CALL<{qury: string, query_type: QueryType}, QueryTableType>(
    "POST",
    ":8060/api/v1/query",
    {
        data: {
            qury: query,
            query_type: "TEXTBOOK"
        }
    },

    // Success
    async (data: QueryTableType) => {
        const query_id = data.id

        if(await savePlanArchive(query_id)){
            console.log(query_id)

            const result = await createTextBookArchive(query_id, index)
            console.log(result)
            if(result) router.push(`./textbook/${query_id}`)
            else{
                // 教科書レコードの生成に失敗
            }
        }else{
            // 学習プランの保存に失敗
        }
    },

    // Error
    async(code: string, message: string) => {
        console.log(message)
    }
)
```
