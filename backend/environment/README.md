# back-ai

## For Linux Users:
- Clone this repository:
```bash
$ git clone https://gitlab.com/abshore-analytics-ia/abs-sirh-ats/back-ai.git
```
- Run the following command:
```bash
cd back-ai 
$ docker-compose -f docker-compose-dev.yml up
```

## For Windows Users:

### Prerequisites

In order to install Back-AI :
- You must clone this repository.
```bash
$ git clone https://gitlab.com/abshore-analytics-ia/abs-sirh-ats/back-ai.git
```
- You must use a valid externally-accessible hostname. Do not use localhost.


### Customizing 

- Open the command prompt (cmd) and run the command `ipconfig`.
- Locate your IPv4 Address under the "Carte Ethernet vEthernet (WSL)" section

```terminal
Adresse IPv4. . . . . . . . . . . . . .: 192.168.192.1
```
Open the `BACK-AI` folder and modify the `docker-compose-dev.yml` file:

- Comment the line 34: 
```python
 #network_mode: host 
 ```

- Uncomment the line 35 and 36:     
``` python
ports:
    - "${CVEX_Back_adminer}:8080"
```

- Add the *OWNCLOUD_TRUSTED_DOMAINS* parameter in the `docker-compose-dev.yml` file under the `environment`section and modify the IP address:
```python
environment:
      - OWNCLOUD_ADMIN_USER=admin
      - OWNCLOUD_ADMIN_PASSWORD=admin
      - OWNCLOUD_TRUSTED_DOMAINS=192.168.192.1
restart: always
```

Open the file `.env.dev` and modify these parameters:
-  `SQL_HOST ` = pgdb_cvex
- ` SQL_PORT` = 5432
- `OWNCLOUD_HOST` =  192.168.192.1 ' (IPv4 Address)
- `OWNCLOUD_URL` = http://192.168.192.1:8080

```
DEBUG=1
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=hamza
SQL_USER=postgres
SQL_PASSWORD=hamza
SQL_HOST=pgdb_cvex
SQL_PORT=5432 
OWNCLOUD_HOST = "192.168.192.1"
OWNCLOUD_PORT = "8080"
OWNCLOUD_USERNAME = "admin"
OWNCLOUD_PASSWORD = "admin"
OWNCLOUD_URL = "http://192.168.192.1:8080"
CHROME_DRIVER_HOST = 'chromeDriver'   # chromeDriver for docker testing / localhost for local testing
DOCKER_TESTING = 'True'  # True for docker testing / False for local testing
HOST_FRONT = 'cvex.abshore.com'
HOST_BACK_CV = 'cvex-back-cv.abshore.com'
HOST_BACK_LINKEDIN = 'cvex-back-linkedin.abshore.com'
METHOD = 'PdfScraper'
```
### Owncloud setting

###  Docker Run
- To run all containers : 
``` bash
cd back-ai 
$ docker-compose -f docker-compose-dev.yml up
```
- Check the logs:
```bash
$ docker-compose -f docker-compose-dev.yml logs -f : logs
```

### Additional Steps for Owncloud
- Access Owncloud via http://localhost:8080/.
- Navigate to Admin > Settings > Security.
- Add the domain http://localhost:4200 to resolve the "host not allowed" issue.

## Accessing Services

- [ ] [CVEX front]( http://localhost:4200/) 
- [ ] [CVEX Back]( http://localhost:8000/) 
- [ ] [Owncloud]( http://localhost:8080/) 
- [ ] [Postgres]( http://localhost:8081/) 

