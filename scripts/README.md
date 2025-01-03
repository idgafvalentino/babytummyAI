# Scripts Directory

This directory contains utility scripts for development, deployment, and maintenance.

## Available Scripts

### `check-status.sh`

Project status verification script that:

- Checks project structure
- Validates documentation
- Reports warnings/issues
- Generates AI context

Usage:

```bash
./scripts/check-status.sh
```

## Development Scripts

### Database Management

- `db-migrate.sh`: Run database migrations
- `db-seed.sh`: Seed database with test data
- `db-backup.sh`: Create database backups

### Testing

- `run-tests.sh`: Execute test suite
- `coverage.sh`: Generate test coverage reports

### Deployment

- `deploy.sh`: Production deployment script
- `rollback.sh`: Deployment rollback script

## Maintenance Scripts

### Cleanup

- `cleanup.sh`: Remove temporary files
- `log-rotate.sh`: Rotate and archive logs

### Monitoring

- `health-check.sh`: System health verification
- `performance.sh`: Performance metrics collection

## Best Practices

1. **Script Creation**

   - Include usage documentation
   - Add error handling
   - Use consistent naming
   - Make scripts executable

2. **Maintenance**

   - Test scripts regularly
   - Update dependencies
   - Document changes
   - Version control

3. **Security**
   - Validate inputs
   - Handle secrets securely
   - Check permissions
   - Log operations

## Usage Guidelines

1. **Before Running Scripts**

   - Check requirements
   - Verify permissions
   - Backup if needed
   - Read documentation

2. **After Running Scripts**
   - Verify results
   - Check logs
   - Clean up temporary files
   - Update documentation
