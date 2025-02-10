terraform {
  required_providers {
    observe = {
      source  = "observeinc/observe"
      version = "0.14.27"  # Ensure this is the latest stable version
    }
  }
}

provider "observe" {
  customer      = "your_customer_id"
  user_email    = "your_email"
  user_password = "your_password"
  domain        = "observeinc.com"
}

# Look up the default workspace
data "observe_workspace" "default" {
  name = "Default"
}

# Define the dataset
resource "observe_dataset" "senior_living_dataset" {
  name        = "Senior Living Contacts"
  description = "Dataset containing contact information for senior living accommodations"
  workspace   = data.observe_workspace.default.id

  inputs = [
    {
      datastream = "your_datastream_id"  # Replace with your datastream ID
    }
  ]

  stage {
    name = "Initial Stage"
    opal = <<-EOT
      // Filter events to include only those related to senior living accommodations
      filter category = "senior_living"

      // Extract contact information fields
      extract_regex field=raw_data pattern="Phone: (?<phone>\\d{3}-\\d{3}-\\d{4})"
      extract_regex field=raw_data pattern="Email: (?<email>\\S+@\\S+\\.\\S+)"
      extract_regex field=raw_data pattern="Website: (?<website>https?://\\S+)"
      extract_regex field=raw_data pattern="Address: (?<address>\\d+\\s+\\w+\\s+\\w+)"

      // Remove entries without contact information
      filter phone is not null or email is not null or website is not null or address is not null

      // Select relevant columns for the dataset
      project phone, email, website, address, timestamp
    EOT
  }
}

# Define the default dashboard for the dataset
resource "observe_default_dashboard" "senior_living_dashboard" {
  dataset = observe_dataset.senior_living_dataset.name

  dashboard {
    name        = "Senior Living Contact Dashboard"
    description = "Dashboard displaying collected senior living contact data"

    widget {
      name = "Total Contacts Scraped"
      type = "timeseries"
      timeseries {
        query = "count(ContactInfo)"
      }
    }
  }
}
