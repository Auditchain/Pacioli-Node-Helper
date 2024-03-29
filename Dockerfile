#   docker build -t auditchainag/pacioli-node-helper .
#       To build you'll need a PacioliNode.env file
#   docker push auditchainag/pacioli-node-helper

FROM node:16

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY *.js .
COPY PacioliNode.env ./.env

EXPOSE 3333
CMD [ "node", "TransactionSigner.js" ]

