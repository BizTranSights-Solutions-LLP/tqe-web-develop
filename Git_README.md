# Git README

Hi! This README will go through the process of applying changes to the remote server.  

## Create a local replica from GitHub (if you don't have one) 
Visit a local directory in Git Bash command line interface, then：   

`git clone https://github.com/The-Quant-Edge/tqe-web-develop.git`  

This will create a copy of the latest TQE Angular project from GitHub in your local directory.  

## Sync and update the local replica with the latest version from GitHub  
In your local project directory, run the following command in Git Bash interface:  
`git pull`

## Angular is a component-based framework

All existing components are located in `/src/app/`. Each component has corresponding html, css and .ts TypeScript files. Make changes in your local project.  

## Push the changes back to GitHub repository  
(Optional) View modified files:  
`git status`  
Add **all** changed files:  
`git add .`  
Or add **a certain** changed file:  
`git add your/path/to/filename`  

Add a meaningful message to your changes:  
`git commit -m "your message here and dont forget the quotation marks"`  
Push to GitHub repository:  
`git push`  
Then enter your GitHub username and password  

## SSH to remote server

Use PuTTY to connect to remote server (staging or product)    
![PuTTY](https://i.imgur.com/g5pIEeR.png)    
Please replace 1.2.3.4 with server's actual IP address.  
Copy root password.  
Then paste the password by click right mouse button in PuTTY, hit enter.  

## Apply the changes to server  
Browse to project directory: 
`cd /var/www/tqe-web-src`  
Pull the latest source code from GitHub repository:  
`git pull tqe-remote master`  

If this VM is the staging server, use the following command to compile the project:  
`npm run build:stage`  
Wait for a minute, once it's finished, edit the `.htaccess` file:  
`vi ../staging/.htaccess`  
Disable the X-Forwarded-Proto to avoid infinite redirection loop    
![](https://i.imgur.com/YidVUUE.png)    
To do that, hit `i` button on keyboard to enter insert mode.  
Then move the cursor to both pink points in the above image and add a `#` mark at the beginning correspondingly .  
Finally, press `Esc` button on keyboard. Type `:wq` and hit `Enter`.  
The last step - restart Apache HTTP service:  
`sudo service apache2 restart`  
Done! Check out the changes on staging site:  
[https://staging.thequantumedge.com/](https://staging.thequantumedge.com/)  

If this VM is the production (live) server, use the following command to compile the project:  
`npm run build:prod`  
Wait for a minute. Once it's finished, check out the changes on main site:  
[https://www.thequantedge.com/](https://www.thequantedge.com/)  
