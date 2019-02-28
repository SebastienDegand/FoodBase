# FoodBase

Application web utilisant la base de données d'Open Food Fact permettant de rechercher
et afficher les informations sur des produits alimentaires.  
 L'application permet également de créer des recettes et de commenter les recettes des
autres utilisateurs.  
 La création de recette fonctionne à l'aide un champs de texte simple comme ceci: macaroni&fromage.
L'application va ensuite chercher les ingrédients requis dans la base de données.

## Application déployée sur Heroku

Vous pouvez essayer directement cette application qui a été déployée sur Heroku:

https://foodbase-client-2.herokuapp.com/

Vous pouvez également effectuer des requêtes au Backend ici:

https://foodbase-server.herokuapp.com/api/v1/foods

## Database

La base de données est une MongoDB déployée sur https://mlab.com/ .

`db_prod_2019-02-28.gz` est un backup de la base de données de production.

Restaurez-le dans votre base de données Mongo avec

```sh
mongorestore --drop --archive=db_prod_2019-02-28.gz --gzip
```

`db_test_2019-02-28.gz` est un backup de la base de données de test.

Restaurez-le dans votre base de données Mongo avec

```sh
mongorestore --drop --archive=db_test_2019-02-28.gz --gzip
```

## Déployer l'application

### Déployer le Backend

```sh
cd Backend/
npm install
npm start
```

Le serveur est executé sur le port 8080

Pour executer les tests:

```sh
npm test
```

### Déployer le Frontend

```sh
cd Frontend/
npm install
npm run build
npm start
```

Le serveur est executé sur le port 3000 et appel le serveur sur le port 8080

## Membres de l'équipe

- Alexandre CLEMENT
- Sébastien DEGAND
- Quentin DURET
- Shiyang HUANG

## Répartition

### Frontend

- Sébastien DEGAND
- Quentin DURET

### Backend

- Alexandre CLEMENT
- Shiyang HUANG
