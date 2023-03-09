<h1 align="center">SNS SDK</h1>
<br />
<p align="center">
<img width="250" src="https://i.imgur.com/nn7LMNV.png"/>
</p>
<p align="center">
<a href="https://twitter.com/bonfida">
<img src="https://img.shields.io/twitter/url?label=Bonfida&style=social&url=https%3A%2F%2Ftwitter.com%2Fbonfida">
</a>
</p>
<br />

<p align="center">
<strong>
SNS SDK monorepo
</strong>
</p>

<div align="center">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" />
</div>

<br />
<h2 align="center">Table of contents</h2>
<br />

1. [Javascript](#javascript)
2. [Rust](#rust)
3. [SDK Proxy](#sdk-proxy)
4. [Python](#python)
5. [Java](#java)
6. [Swift](#swift)
7. [CLI](#cli)
8. [Examples](#examples)
   - Resolving a domain

<br />
<a name="javascript"></a>
<h2 align="center">Javascript</h2>
<br />

```
yarn add @bonfida/spl-name-service
```

```
npm i @bonfida/spl-name-service
```

The JS SDK is the most complete SDK, it contains all the utils methods to interact with domain names as well as instruction builders to register domain names.

<br />
<a name="rust"></a>
<h2 align="center">Rust</h2>
<br />

<br />
<a name="sdk-proxy"></a>
<h2 align="center">SDK Proxy</h2>
<br />

The SDK proxy is a Cloudflare worker that proxies the JS SDK via REST calls. It's meant to be used if you are programming in a language that is not supported. It currently supports the following endpoints:

- `GET /resolve/:domain`: Resolves the current owner of `domain`
- `GET /domain-key/:domain`: Returns the public key of the `domain` account
- `GET /domains/:owner`: Returns the list of domains (public keys) owned by `owner`
- `GET /reverse-key/:domain` Returns the key of the reverse account of `domain`
- `GET /record-key/:domain/:record`: Returns the public key of the `record` of `domain`
- `GET /record/:domain/:record`: Returns the content of the `record` of `domain`. The result is a base64 encoded buffer.
- `GET /favorite-domain/:owner`: Returns the favorite domain of `owner`. If `owner` has not set up a favorite domain it returns `null`
- `GET /types/record`: Returns the list of supported records
- `GET /reverse-lookup/:pubkey`: Returns the reverse lookup of `pubkey`
- `GET /subdomains/:parent`: Returns all the subdomains of `parent`
- `GET /register?buyer={buyer}&domain={domain}&space={space}&serialize={serialize}`: This endpoint can be used to register `domain` for `buyer`. Additionaly, the `buyer` dans specify the `space` it wants to allocate for the `domain` account. In the case where `serialize` is `true` the endpoint will return the transaction serialized in the wire format base64 encoded. Otherwise it will return the instruction in the following format: `{ programId: string, keys: {isWritable: boolean, isSigner: boolean, pubkey: string}[], data: string }` where data is base64 encoded

<br />
<a name="cli"></a>
<h2 align="center">CLI</h2>
<br />

The CLI can be installed with:

```
TODO
```

The CLI has the following commands:

- `sns resolve <domains>`
- `sns domains <owners>`
- `sns burn <domains> <keypair_path>`
- `sns transfer <keypair_path> <new_owner_key> <domains>`
- `sns lookup <domains>`
- `sns reverse-lookup <key>`
- `sns bridge <target_chain> <domain> <keypair_path>`
- `sns register <keypair_path> <space> <domains>`

For instance

```
$ sns resolve bonfida solana.sol coinbase

+------------+----------------------------------------------+----------------------------------------------------------------------------------+
| Domain     | Owner                                        | Explorer                                                                         |
+------------+----------------------------------------------+----------------------------------------------------------------------------------+
| bonfida    | HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA | https://explorer.solana.com/address/HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA |
+------------+----------------------------------------------+----------------------------------------------------------------------------------+
| solana.sol | 3Wnd5Df69KitZfUoPYZU438eFRNwGHkhLnSAWL65PxJX | https://explorer.solana.com/address/3Wnd5Df69KitZfUoPYZU438eFRNwGHkhLnSAWL65PxJX |
+------------+----------------------------------------------+----------------------------------------------------------------------------------+
| coinbase   | 7sF2JumHpWiPjS3XtnQ8cKraTzzfcGSvQHcV3yTaPZ5E | https://explorer.solana.com/address/7sF2JumHpWiPjS3XtnQ8cKraTzzfcGSvQHcV3yTaPZ5E |
+------------+----------------------------------------------+----------------------------------------------------------------------------------+

```

<br />
<a name="python"></a>
<h2 align="center">Python</h2>
<br />
Work in progress

<br />
<a name="java"></a>
<h2 align="center">Java</h2>
<br />
Work in progress

<br />
<a name="swift"></a>
<h2 align="center">Swift</h2>
<br />
Work in progress

<br />
<a name="examples"></a>
<h2 align="center">Examples</h2>
<br />

<br />
<h3 align="center">Resolving a domain</h2>
<br />

The following examples show how to resolve the domain `bonfida.sol`:

1. With the JS SDK

```js
const connection = new Connection(clusterApiUrl("mainnet-beta"));
const owner = await resolve(connection, "bonfida");
expect(owner.toBase58()).toBe("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA");
```

2. With the Rust SDK

```rust
let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
let res = resolve_owner(&client, "bonfida").await.unwrap();
assert_eq!(res, pubkey!("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"));
```

3. With the CLI

```bash
$ sns resolve bonfida

+---------+----------------------------------------------+----------------------------------------------------------------------------------+
| Domain  | Owner                                        | Explorer                                                                         |
+---------+----------------------------------------------+----------------------------------------------------------------------------------+
| bonfida | HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA | https://explorer.solana.com/address/HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA |
+---------+----------------------------------------------+----------------------------------------------------------------------------------+
```

4. With the Cloudflare worker

```bash
GET https://sns-sdk-proxy.bonfida.workers.dev/resolve/bonfida
```

```json
{ "s": "ok", "result": "HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA" }
```
