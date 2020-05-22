# server

## 1) Setup new AWS EC2 instance

- **EC2 AMI:** Ubuntu Server 18.04 LTS (HVM), SSD Volume Type - ami-085925f297f89fce1 (64-bit x86) / ami-05d7ab19b28efa213 (64-bit Arm)
- **Instance type:**
  - **Family: General purpose.
  - **Type:** t2.micro.
  - **vCPUs:** 1.
  - **Memory (GiB):** 1.
  - **Instance storage (GB):** EBS only.
- **Instance details:**
  - All default.
- **Storage:**
  - **Size:** 8 (GiB).
  - **Volume type:** General purpose SSD (gp2).
- **Security groups:**
  - Type  | Protocol | Port Range | Source
  - SSH   | TCP      | 22         | Local development IP
  - HTTP  | TCP      | 80         | Anywhere [0.0.0.0/0, ::/0]
  - HTTPS | TCP      | 443        | Anywhere [0.0.0.0/0, ::/0]

---

## 2) First SSH to server

- Update ownership of `ssh-key.pem`, run `chmod 600 ssh-key.pem`.
- SSH to server, run `ssh ubuntu@IP -i ssh-key.pem`.
- Update server packages, run `sudo apt update`.
- Upgrade server packages, run `sudo apt upgrade`
- **Install Git:**
  - Navigate to home directory, run `cd ~`.
  - Install, run `sudo apt install git`.
  - Verify version, run `git --version`.
  - **Update user information:**
    - Update username, run `git config --global user.name "[username]"`.
    - Update email, run `git config --global user.email "[name@domain.com]"`.
    - Verify user information, run `cat ~/.gitconfig`.

---

## 3) Point domain to server

Head over to your domain provider and edit the DNS settings to:
- Type  | Name | Value | TTL    
- a     | @    | IP    | 600 seconds
- cname |	www  | @     | 600 seconds

---

## [4) How To Install Nginx on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04)

Now that you have your web server up and running, let’s review some basic management commands.

- Check nginx status, type: `systemctl status nginx`
- To stop your web server, type: `sudo systemctl stop nginx`
- To start the web server when it is stopped, type: `sudo systemctl start nginx`
- To stop and then start the service again, type: `sudo systemctl restart nginx`
- If you are simply making configuration changes, Nginx can often reload without dropping connections. To do this, type: `sudo systemctl reload nginx`
- By default, Nginx is configured to start automatically when the server boots. If this is not what you want, you can disable this behavior by typing: `sudo systemctl disable nginx`
- To re-enable the service to start up at boot, you can type: `sudo systemctl enable nginx`

---

## [5) How To Secure Nginx with Let's Encrypt on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04)

- To test renewal process, run `sudo certbot renew --dry-run`.
- To renew expired certificates, run `sudo certbot renew`.

## [6) How To Set Up a Node.js Application for Production on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04)

- Change `curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh` to `curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh` for later version of Node.
