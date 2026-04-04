# FROM public.ecr.aws/lambda/nodejs:20

# COPY app.js package*.json /var/task/

# RUN npm ci --only=production

# CMD [ "app.handler" ]

FROM public.ecr.aws/lambda/nodejs:20

COPY . /var/task/

RUN npm i -f

CMD [ "server.handler" ]