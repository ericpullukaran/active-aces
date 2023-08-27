# Active Aces

## Development Setup

To run the development environment, you'll need to execute certain commands in separate terminals. Also we will be using `@antfu/ni`, highly recommend.

### Steps

1. **Run the Web Environment**

   Open a new terminal and execute:

   ```
   nr web
   ```

2. **Run the Development Server**

   Open another new terminal and execute:

   ```
   nr dev
   ```

### Troubleshooting

#### Issue with tRPC Types

If you encounter any issues related to tRPC types, you may need to clear out your `node_modules` folders and reinstall packages.

1. **Clear Node Modules**

   Navigate to the project root directory and run:

   ```
   npx npkill
   ```

   Use the interactive terminal to destroy all `node_modules` folders.

2. **Reinstall Dependencies**

   Run the following command to reinstall all the necessary packages:

   ```
   ni
   ```

3. **Clear Expo Cache and Start Dev Server**

   Execute the following commands:

   ```
   expo start -c
   ```

   And then start up the `development server` as normal.

For more troubleshooting guides, visit [Native Wind Troubleshooting](https://www.nativewind.dev/guides/troubleshooting).
