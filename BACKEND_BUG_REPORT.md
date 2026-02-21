# 🐛 Backend Bug Report - SQL Database Error

## Error Details

**Endpoint:** `https://kaffak.company/kaffak/webservice/get_product_list_by_filter`
**Error Type:** SQL Database Error
**Error Number:** 1054
**Message:** Unknown column 'rest_id' in 'where clause'

---

## Stack Trace

```
A Database Error Occurred
Error Number: 1054

Unknown column 'rest_id' in 'where clause'

SELECT AVG(`rating`) AS `rating` FROM `rating_review` WHERE `rest_id` = '1'

Filename: controllers/Webservice.php
Line Number: 10630
```

---

## Root Cause

The CodeIgniter controller `Webservice.php` at line **10630** is trying to query the `rating_review` table with a column `rest_id` that **doesn't exist** in the database schema.

### Problematic SQL:
```sql
SELECT AVG(`rating`) AS `rating` FROM `rating_review` WHERE `rest_id` = '1'
```

### Expected Schema (from database-schema.sql):
```sql
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    provider_id VARCHAR(255),
    order_id VARCHAR(255),
    rating INT,
    review TEXT,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    ...
);
```

**Note:** The table is named `ratings` (not `rating_review`) and uses `provider_id` (not `rest_id`).

---

## Solution for Backend Team

### Option 1: Fix Column Name (Recommended)
Change `rest_id` to `provider_id` in the query:

**File:** `controllers/Webservice.php`  
**Line:** 10630

**Before:**
```php
$this->db->where('rest_id', $provider_id);
```

**After:**
```php
$this->db->where('provider_id', $provider_id);
```

### Option 2: Fix Table Name
If the table is actually `rating_review`, ensure it exists with correct schema:

```sql
CREATE TABLE IF NOT EXISTS rating_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rest_id VARCHAR(255),  -- or provider_id
    user_id VARCHAR(255),
    rating INT,
    review TEXT,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Option 3: Add Alias Column
Add `rest_id` as an alias or duplicate column:

```sql
ALTER TABLE ratings ADD COLUMN rest_id VARCHAR(255);
UPDATE ratings SET rest_id = provider_id WHERE provider_id IS NOT NULL;
```

---

## Files to Check

1. **controllers/Webservice.php** - Line 10630
2. **database-schema.sql** - Check actual table structure
3. **models/Rating_model.php** - Check if query is defined there
4. **config/database.php** - Verify database connection

---

## Impact

**Affected Endpoints:**
- `get_product_list_by_filter`
- Any endpoint that calculates product/provider ratings
- Product detail pages
- Store listing pages

**User Impact:**
- Cannot view products
- Cannot see ratings
- App appears broken

---

## Quick Fix Command (For Backend Team)

If they have SSH access:

```bash
# Login to MySQL
mysql -u username -p database_name

# Check actual table structure
DESCRIBE rating_review;
DESCRIBE ratings;

# Check which tables exist
SHOW TABLES LIKE '%rating%';

# Fix the query (temporary)
# Edit controllers/Webservice.php line 10630
nano controllers/Webservice.php
# Change 'rest_id' to 'provider_id'

# Restart Apache
sudo systemctl restart apache2
```

---

## Testing After Fix

1. **Test Endpoint:**
   ```
   https://kaffak.company/kaffak/webservice/get_product_list_by_filter
   ```
   
2. **Expected Response:**
   ```json
   {
     "status": "success",
     "message": "Products retrieved successfully",
     "result": [
       {
         "id": "1",
         "item_name": "Product Name",
         "avg_rating": 4.5,
         ...
       }
     ]
   }
   ```

3. **Check Web App:**
   - Refresh http://localhost:3000
   - Products should load
   - Error banner should disappear

---

## Contact Information

**Server:** kaffak.company  
**Framework:** CodeIgniter  
**Database:** MySQL  
**Error Location:** controllers/Webservice.php:10630

---

## Priority: 🔴 **CRITICAL**

This is a **blocking issue** that prevents all users from:
- Viewing products
- Browsing stores
- Using the app

**Action Required:** Backend developer must fix the SQL query immediately.

---

**Report Generated:** 2026-02-21  
**Status:** ⏳ Waiting for backend fix
