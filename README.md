# Node Dash

A modern, flow-based device management layer for the Helium Network that sits on top of ChirpStack to provide an easier option to manage IoT devices with visual flow-based data routing.

## Overview

Node Dash simplifies IoT device management by providing a visual, flow-based interface for routing data between devices, functions, and integrations. Built with React, TypeScript, and Vite, this application offers a modern UI for managing your Helium Network devices through ChirpStack.

### Key Features

- **Visual Flow Editor**: Create and manage data flows with an intuitive drag-and-drop interface
- **Device Management**: Monitor and control IoT devices connected to the Helium Network
- **Custom Functions**: Create and deploy JavaScript functions to transform and process device data
- **Integration Management**: Connect to external services via HTTP and MQTT protocols
- **Label System**: Organize devices with customizable labels for efficient management
- **History Tracking**: View detailed history of devices, functions, integrations and flows
- **Internationalization**: Full support for multiple languages (English, Spanish, French, German)
- **Dark/Light Mode**: User-selectable theme preferences
- **Mobile First Design**: Manage your devices on the move, our design is fully responsive!

## Architecture

The application consists of several key components:

- **Flows**: Visual representations of data routing between devices, functions, and integrations
- **Devices**: IoT devices connected to the Helium Network through ChirpStack
- **Labels**: Tags to group devices for easy flow management
- **Functions**: Custom JavaScript code that can transform and process data
- **Integrations**: Connections to external services via HTTP and MQTT

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- ChirpStack instance connected to Helium Network

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd helium-device-manager

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

### Managing Devices

The Devices page allows you to:

- View all connected devices
- Monitor device status (online/offline)
- View device details and last seen timestamp
- Associate devices with labels
- View device history

### Creating Custom Functions

1. Navigate to the Functions page
2. Click "Add Function"
3. Write your JavaScript code in the editor
4. Save and use the function in your flows
5. View execution history of your functions

### Setting Up Integrations

The application supports multiple integration types:

- **HTTP**: Connect to REST APIs and webhooks
- **MQTT**: Connect to message brokers for IoT communication

### Creating a Flow

1. Navigate to the Flows page
2. Click "Add Flow"
3. Use the visual editor to add devices, functions, and integrations
4. Connect the nodes to establish data routing
5. Save your flow to deploy it

### Managing Labels

The Labels page allows you to:

- Create and manage device groupings
- Associate multiple devices with a single label
- Use labels in flows to process data from grouped devices

## Development

### Tech Stack

- React 19
- TypeScript
- Vite 6
- XY Flow (React Flow v12)
- Tailwind CSS 4
- i18next for internationalization (supports English, Spanish, French, and German)
- TanStack Query for data fetching and caching

### Project Structure

- `/src/components`: UI components (including flow, modals, nodes, and UI components)
- `/src/context`: Context providers (Theme and Language contexts)
- `/src/hooks`: Custom React hooks
- `/src/pages`: Application pages
- `/src/services`: API services
- `/src/locales`: Internationalization files (en, es, fr, de)
- `/src/nodes`: Flow editor node types
- `/src/edges`: Flow editor edge types
- `/src/types`: TypeScript type definitions
- `/src/lib`: Utility functions

### Available Pages

- **Devices Page**: View and manage connected IoT devices
- **Device Detail Page**: View detailed information about a specific device
- **Functions Page**: Create and manage JavaScript transformation functions
- **Integrations Page**: Configure connections to external services
- **Flows Page**: List and manage flows
- **Flow Detail Page**: Visual editor for creating and editing flows
- **Labels Page**: Manage device groupings and labels
- **Settings Page**: Application configuration and preferences

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contributing

We welcome contributions to the Node Dash! This section outlines the process for contributing to the project.

### Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please be respectful and constructive in all interactions.

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a new branch** for your feature or bugfix
4. **Make your changes** following our coding standards
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your branch**
7. **Open a Pull Request** against the main branch

For more detailed contribution guidelines, please see our [CONTRIBUTING.md](./CONTRIBUTING.md) file.
