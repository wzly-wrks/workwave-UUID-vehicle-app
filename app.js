class WorkWaveVehicleApp {
    constructor() {
        this.vehicles = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadVehicles();
    }
    
    initializeElements() {
        this.vehicleSelect = document.getElementById('vehicleSelect');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.vehicleDetails = document.getElementById('vehicleDetails');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }
    
    bindEvents() {
        this.vehicleSelect.addEventListener('change', (e) => {
            this.displayVehicleDetails(e.target.value);
        });
        
        this.refreshBtn.addEventListener('click', () => {
            this.loadVehicles();
        });
    }
    
    async loadVehicles() {
        this.showLoading(true);
        this.hideError();
        this.vehicleSelect.disabled = true;
        
        try {
            const url = '/api/vehicles';
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            // Convert vehicles object to array for easier handling
            this.vehicles = Object.values(data.vehicles || {});
            this.populateVehicleSelect();
            this.showSuccess(`Loaded ${this.vehicles.length} vehicles successfully`);
            
        } catch (error) {
            console.error('Error loading vehicles:', error);
            this.showError(`Failed to load vehicles: ${error.message}`);
            this.vehicles = [];
            this.populateVehicleSelect();
        } finally {
            this.showLoading(false);
            this.vehicleSelect.disabled = false;
        }
    }
    
    populateVehicleSelect() {
        // Clear existing options
        this.vehicleSelect.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = this.vehicles.length > 0 
            ? 'Select a vehicle...' 
            : 'No vehicles available';
        this.vehicleSelect.appendChild(defaultOption);
        
        // Add vehicle options sorted by externalId
        this.vehicles
            .filter(vehicle => vehicle.externalId) // Only include vehicles with externalId
            .sort((a, b) => a.externalId.localeCompare(b.externalId))
            .forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id; // Use the UUID as value
                option.textContent = vehicle.externalId;
                option.dataset.vehicle = JSON.stringify(vehicle);
                this.vehicleSelect.appendChild(option);
            });
        
        // Reset vehicle details display
        this.displayVehicleDetails('');
    }
    
    displayVehicleDetails(vehicleId) {
        if (!vehicleId) {
            this.vehicleDetails.innerHTML = '<p>Select a vehicle to view its details</p>';
            return;
        }
        
        const selectedOption = this.vehicleSelect.querySelector(`option[value="${vehicleId}"]`);
        if (!selectedOption) {
            this.vehicleDetails.innerHTML = '<p>Vehicle not found</p>';
            return;
        }
        
        const vehicle = JSON.parse(selectedOption.dataset.vehicle);
        
        this.vehicleDetails.innerHTML = `
            <div class="external-id">External ID: ${vehicle.externalId}</div>
            <p><strong>Vehicle UUID:</strong></p>
            <div class="uuid">${vehicle.id}</div>
            ${vehicle.name ? `<p><strong>Name:</strong> ${vehicle.name}</p>` : ''}
            ${vehicle.description ? `<p><strong>Description:</strong> ${vehicle.description}</p>` : ''}
            ${vehicle.vehicleType ? `<p><strong>Type:</strong> ${vehicle.vehicleType}</p>` : ''}
            ${vehicle.capacity ? `<p><strong>Capacity:</strong> ${vehicle.capacity}</p>` : ''}
            ${vehicle.active !== undefined ? `<p><strong>Status:</strong> ${vehicle.active ? 'Active' : 'Inactive'}</p>` : ''}
        `;
    }
    
    showLoading(show) {
        if (show) {
            this.loadingIndicator.classList.remove('hidden');
        } else {
            this.loadingIndicator.classList.add('hidden');
        }
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.errorMessage.className = 'error';
    }
    
    showSuccess(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.errorMessage.className = 'success';
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            this.hideError();
        }, 3000);
    }
    
    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorkWaveVehicleApp();
});