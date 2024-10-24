provider "google" {
  project = "gd-gcp-october-event"
  region  = "us-central1"
  zone    = "us-central1-a"
}

resource "google_compute_instance" "app_instance" {
  name         = "app-instance"
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
    }
  }

  network_interface {
    network = "default"

    access_config {
      // Ephemeral IP
    }
  }

  metadata_startup_script = <<EOF
    #!/bin/bash
    apt-get update
    apt-get install -y docker.io docker-compose
    systemctl start docker
    systemctl enable docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo chmod 666 /var/run/docker.sock
    mkdir /home/msingh/projects && git clone https://github.com/grid-bot-dev/innovation_day_event_monorepo.git /home/msingh/projects/
    mv /home/msingh/.env /home/msingh/projects/backend/
    sudo apt-get install unzip
    sudo rm -rf /home/msingh/.config
    cd ~ && sudo unzip -d /home/msingh/ /home/msingh/.config.zip
    cd /home/msingh/projects/
    docker compose up -d 
EOF

  tags = ["http-server", "https-server"]

  provisioner "file" {
    source      = "/Users/msingh/Desktop/cred/.env"
    destination = "/home/msingh/.env"

    connection {
      type     = "ssh"
      user     = "msingh"
      private_key = file("~/.ssh/id_rsa")
      host     = self.network_interface[0].access_config[0].nat_ip
    }
  }

  provisioner "file" {
    source      = "/Users/msingh/Desktop/cred/.config.zip"
    destination = "/home/msingh/.config.zip"

    connection {
      type     = "ssh"
      user     = "msingh"
      private_key = file("~/.ssh/id_rsa")
      host     = self.network_interface[0].access_config[0].nat_ip
    }
  }
  
}

resource "google_compute_firewall" "allow_http" {
  name    = "allow-http-1"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "8000"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}
