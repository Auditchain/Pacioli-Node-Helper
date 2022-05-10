Composer file executing a Pacioli node container, and providing a "password storage" second container, 
so that on Pacioli node restart it doesn't get stuck asking a human user for keystore file location and password.

To execute:

    Make sure images auditchainag/paciolinode and auditchainag/pacioli-node-helper are available on hub.docker.com

    Download the docker-compose.yml file in this repository to your directory

    Make sure your encrypted keystore file is in that directory, as well as a PacioliNode.env file; cd to that directory and:

        docker-compose run paciolinode

    Answer the two questions by the Pacioli node agent (keystore location, prefixed by /secret/ ; and its password); 
    so for keystore myKeystore, the location answer should be /secret/myKeystore . 
    Notice that the Pacioli container wil have access to your current directory

(you may need to authenticate first on Docker hub with docker login -u auditchainag, cf. node operation instructions)


For more information see discussion in https://github.com/Auditchain/Knowledge-Base/blob/master/AlphaDocumentation/SecretsInPacioliNodes.md

providerManger made by Bogdan Fiedur, Docker composing by Fuad Begic