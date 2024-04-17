# Quasar App (quasar-project)

A Quasar Project

Les utilisateurs :
- Romain -> manager
- charlotte -> RH
- sacha/theo/melene -> employés

(pas besoin de mot de passe)

Il y a quelques soucis de parallélisme donc ne pas faire attention si quelques fois certaines infos disparaissent

## To start frontend (quasar) & backend nodejs/express
```bash
docker compose up -d
```


### Lint the files
```bash
docker exec -it quasar yarn lint
```


### Format the files
```bash
docker exec -it quasar yarn format
```



### Build the app for production (Change API for production & secret keys)
```bash
docker exec -it quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
