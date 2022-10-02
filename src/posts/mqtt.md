---
title: CentOS 7にmosquitto(MQTT)をインストールする 
description: この記事は2016年1月9日に投稿した記事を復元したものです。
date: 2016-01-09
---
# CentOS 7にmosquittoをインストールする

## バージョン情報

* mosquitto version 1.4.7 (build date 2015-12-27 20:21:31+0000)

```shell
openssl version
OpenSSL 1.0.1e-fips 11 Feb 2013
```

## ポートを開ける

IoTデバイス等の外部からのメッセージを受けることを想定して、SSL/TLSのMQTTのポート(8883)を開けます。

```shell
sudo firewall-cmd --add-port=8883/tcp --zone=public --permanent
sudo systemctl restart firewalld
```

## mosquitto.repoの作成

http://mosquitto.org/download/ のCentOS 7のリンクにアクセスして、/etc/yum.repos.d/mosquitto.repo を作成します。

```shell
sudo yum update
sudo yum install mosquitto mosquitto-clients
sudo systemctl enable mosquitto
```

## 認証局の証明書作成

いわゆるオレオレ認証局の証明書を作成します。有効期限は１年間(365日)で作成しています[^1]。

```shell
mkdir /opt/ca
cd /opt/ca
openssl req -new -x509 -days 365 -extensions v3_ca -keyout ca.key -out ca.crt
```

## サーバ証明書作成

MQTTサーバで使用するサーバ証明書を作成します。

```shell
mkdir /opt/server
cd /opt/server
openssl genrsa -out server.key 2048
openssl req -out server.csr -key server.key -new
openssl x509 -req -in server.csr -CA /opt/ca/ca.crt -CAkey /opt/ca/ca.key -CAcreateserial -out server.crt -days 365
```

## パスワードファイル作成

パスワードファイルを作成します。この例ではmqttユーザのパスワードを設定します。

```shell
sudo mosquitto_passwd -c /etc/mosquitto/pwfile mqtt
```

## 設定ファイル

/etc/mosquitto/mosquitto.conf を次のように記述します。

```text
# Place your local configuration in /etc/mosquitto/conf.d/

pid_file /var/run/mosquitto.pid

listener 8883
cafile /opt/ca/ca.crt
certfile /opt/server/server.crt
keyfile /opt/server/server.key

persistence true
persistence_location /var/lib/mosquitto/

#log_dest file /var/log/mosquitto/mosquitto.log

allow_anonymous false

password_file /etc/mosquitto/pwfile

include_dir /etc/mosquitto/conf.d
```

## サーバの起動

```shell
sudo systemctl start mosquitto
```
 
# Publish

```shell 
mosquitto_pub -h [FQDN] -p 8883 --cafile /opt/ca/ca.crt -u mqtt -P [PASSWORD] -t 'topic/test' -m 'foo'
```

# Subscribe

```shell
mosquitto_sub -h [FQDN] -p 8883 --cafile /opt/ca/ca.crt -u mqtt -P [PASSWORD] -v -t 'topic/test'
```

[^1]: 認証局のCN(Common Name)とサーバ証明書のCN(Common Name)に同じ値を設定すると、CAが見つからないというようなエラーが発生します。
