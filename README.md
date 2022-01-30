# TeaAppServices

TeaAppServices est une api de type REST permettant différentes opérations.

## les routes possibles 

### /tea 
- Get
    - **"/"** retourne tout les thés
    - **"/:id"** retourne le thé en fonction de _id
    - **"/instock"** retourne les thés qui ont du stock
- Post
    - **"/"** permet d'ajouter une référence
    - **"/:id/stock"** permet d'ajouter du stock à une référence
- Put 
    - **"/"** permet de modifier un thé 
    - **"/:id/stock/out"** permet de supprimer un stock 
- Delete
    - **"/"** permet de supprimer un thé
    - **"/all"** permet de supprimer tout les thés

### /log 
- Get
    - **"/"** retourne tout les logs
    - **"/pagination"** retourne tout les logs avec une pagination serveur
    - **"/:id"** renvoie tout les logs en fonction du document._id sur lequel c'est passé l'opération 
- Put 
    - **"/"** permet de modifier un log ( seul le commentaire est autorisé ) 
- Delete
    - **"/all"** permet de supprimer tout les logs

### /user 
- Get
    - **"/"** retourne tout les utilisateurs
- Post 
    - **"/addUser"** permet d'ajouter un nouvel utilisateur 
    - **"/connection"** permet de connecter un utilisateur 

## consigne d'installation local 

Prérequis: 
- mongodb sur son poste et démarré
- nodeJS installé

Pour lancer le projet en local il faut faire à la racine du projet: 

``` 
npm i 
```

puis si vous voulez lancer l'applicatif en mode developpement : 
```
npm run dev
```
