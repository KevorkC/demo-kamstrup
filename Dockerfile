FROM node:13-alpine

# Indstiller envirnmet variables
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

# Laver et directory i containeren
RUN mkdir -p /home/app

# Kopiere app mappen til containeren's /home/app
COPY ./app /home/app

# Sætter standard directory til lokationen /home/app
WORKDIR /home/app

# Eksekvér npm install i den indtastede WORKDIR lokaiton
RUN npm install

# CMD starter serveren når containeren startes 
# Man behøver ikke at skrive /home/app/server.js fordi WORKDIR er sat tidligere
CMD ["node", "server.js"]
