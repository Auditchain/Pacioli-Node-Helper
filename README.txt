Composer file executing a Pacioli node container, and providing a "password storage" second container, 
so that on Pacioli node restart it doesn't get stuck asking a human user for keystore file location and password.

To execute:

    Adjust your path to the secret directory on your server (host), in the /secret/ volume in docker-compose.yml
    Make sure your encrypted keystore file is in that directpry, as well as a PacioliNode.env file

    docker compose run paciolinode bash --build

    Answer the two questions by the Pacioli node agent (keystore location and its password)

(you may need to authenticate first on Docker hub with docker login -u auditchainag, cf. node operation instructions)


For more information see discussion in https://github.com/Auditchain/Knowledge-Base/blob/master/AlphaDocumentation/SecretsInPacioliNodes.md

providerManger made by Bogdan Fiedur, Docker composing by Fuad Begic