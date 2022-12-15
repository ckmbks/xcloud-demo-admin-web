# 基础镜像
FROM registry.cn-hangzhou.aliyuncs.com/bsnl/node:alpine

# 创建工作目录
WORKDIR /usr/src/app
COPY ./dist /usr/src/app/dist
COPY ./app.js /usr/src/app/app.js
COPY ./package.json /usr/src/app/package.json

RUN chmod -R 777 /root/
RUN npm install -g cnpm
# RUN npm install -g cnpm
# RUN npm config set registry registry=https://registry.npmmirror.com
RUN cnpm install http-proxy-middleware express connect-history-api-fallback -S

# 容器启动命令
CMD [ "node", "app.js" ]
