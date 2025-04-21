EDISS - A3

CF - 
￼
LabRole

On New EC2 - SSH
￼


And create that secret once:
bash
CopyEdit
kubectl create secret generic smtp-secret \
  --from-literal=user='exemail@gmail.com' \
  --from-literal=pass='aaaa gzyy x00o yuvj' \
  -n bookstore-ns

##DOCKER BUILD: 
docker buildx build --platform linux/amd64,linux/arm64 \
-t jigyasag/ediss-a3-book-service:v3 \
book-service --push

docker buildx build --platform linux/amd64,linux/arm64 \
-t jigyasag/ediss-a3-customer-service:v3 \
customer-service --push

docker buildx build --platform linux/amd64,linux/arm64 \
-t jigyasag/ediss-a3-crm-service:v3 \
crm-service --push

docker buildx build --platform linux/amd64,linux/arm64 \
-t jigyasag/ediss-a3-mobile-bff:v3 \
mobile-bff --push

docker buildx build --platform linux/amd64,linux/arm64 \
-t jigyasag/ediss-a3-web-bff:v3 \
web-bff --push


##Change the Image references

## New EC2 Instance: 
Name : EC2BookstoreAdmin

SG Name : EC2BookstoreAdmin-SG

##ON EC2 SSH: 
sudo rm /usr/local/bin/kubectl

sudo curl -Lo /usr/local/bin/kubectl \
https://dl.k8s.io/release/v1.32.0/bin/linux/arm64/kubectl

sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

kubectl version --client

MAKE AWS CREDENTIALS file FROM LL:

## contexts
kubectl config get-contexts

## EC2 interacts with this cluster - configure it to interact

aws eks update-kubeconfig --name bookstore-dev-BookstoreEKSCluster --region us-east-1


##COpy Files to EC2

scp -i labsuser.pem ./k8s/* ec2-user@98.81.167.52:~

kubectl apply -f namespace.yaml
kubectl apply -f bs-service.yaml
kubectl apply -f cs-service.yaml
kubectl apply -f crm-service.yaml
kubectl apply -f wbff-service.yaml
kubectl apply -f mbff-service.yaml

kubectl get services -n bookstore-ns 
kubectl get namespaces
kubectl get pods -n bookstore-ns -o=wide

kubectl apply -f bs-deployment.yaml
kubectl apply -f cs-deployment.yaml
kubectl apply -f crm-deployment.yaml

## pods start

##Updated using kubectl get services -n bookstore-ns :

sudo dnf install mariadb105-server -y
mysql -h bookstore-db-dev.cluster-cd20i0i40rro.us-east-1.rds.amazonaws.com -u root -p


kubectl describe pod customer-service-775495fd9c-gnwch -n bookstore-ns


##After local changes:
 kubectl apply -f bs-deployment.yaml     -n bookstore-ns
kubectl apply -f bs-service.yaml        -n bookstore-ns
kubectl apply -f crm-deployment.yaml    -n bookstore-ns
kubectl apply -f crm-service.yaml       -n bookstore-ns
kubectl apply -f cs-deployment.yaml     -n bookstore-ns
kubectl apply -f cs-service.yaml        -n bookstore-ns
kubectl apply -f mbff-deployment.yaml   -n bookstore-ns
kubectl apply -f mbff-service.yaml      -n bookstore-ns
kubectl apply -f wbff-deployment.yaml   -n bookstore-ns
kubectl apply -f wbff-service.yaml      -n bookstore-ns
   kubectl rollout restart deployment/book-service       -n bookstore-ns
kubectl rollout restart deployment/crm-service        -n bookstore-ns
kubectl rollout restart deployment/customer-service   -n bookstore-ns
kubectl rollout restart deployment/mobile-bff         -n bookstore-ns
kubectl rollout restart deployment/web-bff            -n bookstore-ns
  OR  kubectl rollout restart deploy book-service       -n bookstore-ns
kubectl rollout restart deploy crm-service        -n bookstore-ns
kubectl rollout restart deploy customer-service   -n bookstore-ns
kubectl rollout restart deploy mobile-bff         -n bookstore-ns
kubectl rollout restart deploy web-bff            -n bookstore-ns
  OR

kubectl rollout status deployment/book-service     -n bookstore-ns
kubectl rollout status deployment/crm-service      -n bookstore-ns
kubectl rollout status deployment/customer-service -n bookstore-ns
kubectl rollout status deployment/mobile-bff       -n bookstore-ns
kubectl rollout status deployment/web-bff          -n bookstore-ns
