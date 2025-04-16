Création des Microservices : Nous avons développé des microservices pour gérer les films et les séries TV. Chaque service expose des API REST et GraphQL pour permettre l'interaction avec les clients.

Implémentation de Kafka : Nous avons intégré Kafka pour la gestion de la communication entre les microservices. Un producteur Kafka a été mis en place pour envoyer des messages lorsque de nouvelles données (films ou séries) sont créées ou mises à jour. De plus, un consommateur Kafka a été développé pour traiter les messages entrants d'autres services.

Gestion de la base de données : Le projet a été connecté à une base de données, en respectant le schéma de données spécifié. Cela permet de stocker et d'organiser les informations relatives aux films et aux séries TV de manière efficace.

Création des Topics Kafka : Nous avons créé les topics Kafka movies_topic et tvshows_topic pour gérer les messages entre les services. Ces topics sont utilisés pour diffuser les informations des films et des séries TV dans le système.

API Gateway : L'API Gateway a été configurée pour publier des messages vers les topics appropriés de Kafka lors des opérations CRUD effectuées par les utilisateurs via les API REST et GraphQL.
