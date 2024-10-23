# Snapper

Snapper is an automated database backup service which can be self deployed over AWS cloud with just a few commands.

It uses [SST](https://sst.dev/) (a framework based on [Pulumi](https://www.pulumi.com/) and [Terraform](https://www.terraform.io/)) for provisioning infrastructure and deployment.

`Currently only PostgreSQL databases are supported.`

## Installation

```bash

```

## Architecture

Snapper uses a cron job, queues, along with serverless functions and object storage for reliablility and scalability.

![Architecture](./assets/architecture.png)

## Few TODOS:

- Implement streaming chuks of backup file data to S3 bucket, to avoid loading whole file in function memory.
- Implement an optional encryption feature to encrypt the backup data.
- Implement some form of light UI layer to setup the backups.
- Test and handle very large data backups which may timeout the serverless function.
- Add support for other commonly used databases.
- Implement a possible saas offering.

---

### Credits

- [pgdump-aws-lambda](https://github.com/jameshy/pgdump-aws-lambda) - for migrating pg_dump binary to lambda, other ideas and code inspirations.
