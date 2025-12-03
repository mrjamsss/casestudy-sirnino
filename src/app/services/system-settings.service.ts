import { Injectable } from '@angular/core';

export interface CityInfo {
    name: string;
    captain: string;
    address: string;
    contact: string;
}

export interface VisionMission {
    vision: string;
    mission: string;
}

export interface CityOfficial {
    id?: string;
    name: string;
    position: string;
    picture?: string;
    order?: number;
}

@Injectable({
    providedIn: 'root'
})
export class SystemSettingsService {
    private readonly CITY_INFO_KEY = 'cityHallInfo';
    private readonly VISION_MISSION_KEY = 'visionMission';
    private readonly LOGO_KEY = 'cityHallLogo';
    private readonly OFFICIALS_KEY = 'cityHallOfficials';

    constructor() { }

    // City Info
    getCityInfo(): CityInfo | null {
        const stored = localStorage.getItem(this.CITY_INFO_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    // Vision & Mission
    getVisionMission(): VisionMission | null {
        const stored = localStorage.getItem(this.VISION_MISSION_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    // Logo
    getLogo(): string | null {
        return localStorage.getItem(this.LOGO_KEY);
    }

    // Officials
    getOfficials(): CityOfficial[] {
        const stored = localStorage.getItem(this.OFFICIALS_KEY);
        return stored ? JSON.parse(stored) : [];
    }
}
