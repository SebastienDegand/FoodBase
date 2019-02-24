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

La base de données est une MongoDB déployée sur https://mlab.com/ .

## Déployer l'application:

### Déployer le Backend:

```
$ cd Backend/
$ npm install
$ npm start
```
Le serveur est executé sur le port 8080

Pour executer les tests:

```
$ npm test
```

### Déployer le Frontend:

```
$ cd Frontend/
$ npm install
$ npm run build
$ npm start
```

Le serveur est executé sur le port 3000 et appel le serveur sur le port 8080

## Membres de l'équipe
- Alexandre CLEMENT
- Sébastien DEGAND
- Quentin DURET
- Shiyang HUANG
