<template>
	<div>
		<Loading :loading="loading" />
	</div>
</template>
<script lang='ts'>
	import { Component } from "vue-property-decorator";
	import UploadedFile, { Row } from "@/entities/UploadedFile";
	import { updateUploadedFile } from "@/store/exploreStore";
	import _View from "./_View";
	import exampleApi from "@/api/example";
	import ExampleTeaserI from "@/entities/ExampleTeaser";
	import Loading from "@/components/Shared/Loading/Loading.vue";
	import { RouteNames } from '@/router/index';
	import jsonData from '@/public/jobDataWithCoordinates.json';




	/**
	* Home page to load JSON data and navigate to the next page
	*/
	@Component({
	name: "ViewsHome",
	components: {
	Loading,
	},
	})
	export default class Home extends _View {
	private loading: boolean = false;
	private currentTime: string = '';

	private getCurrentDateTime(): string {
	const currentDate = new Date();
	const dateString = currentDate.toLocaleDateString('en-GB', {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	});
	return dateString;
	}

	private startClock() {
	setInterval(() => {
	const currentDateTime = this.getCurrentDateTime();
	this.currentTime = currentDateTime;
	if (this.uploadedFile) {
	this.uploadedFile.fileName = currentDateTime;
	}
	}, 1000); // Update the time every 1 second (1000 ms)
	}

	private uploadedFile: UploadedFile | null = null;
	private socket: WebSocket | null = null;

	private initWebSocket() {
	this.socket = new WebSocket('ws://localhost:8081');

	this.socket.addEventListener('open', () => {
	console.log('WebSocket connected');
	});

	this.socket.addEventListener('message', (event) => {
	console.log('Received message from WebSocket:', event.data);
	if (event.data === 'fileChanged') {
	console.log('File changed, reloading data');
	this.loadJsonData();
	}
	});


	this.socket.addEventListener('close', () => {
	console.log('WebSocket disconnected');
	this.socket = null;
	});
	}


	private async loadJsonData() {
	this.loading = true;
	try {
	const response = await fetch(`/jobDataWithCoordinates.json?${new Date().getTime()}`);
	const jsonData = await response.json();

	console.log('Loaded JSON data:', jsonData);

	const headers = Object.keys(jsonData[0]);

	// Convert JSON data to array format
	const dataAsArray = jsonData.map((job) => {
	if (job.latitude === undefined || job.longitude === undefined) {
	console.warn(`Job ${job['Job No.']} does not have a latitude and/or longitude.`);
	job.latitude = job.latitude ?? null;  // Update this as per your requirements
	job.longitude = job.longitude ?? null;  // Update this as per your requirements
	}
	return Object.values(job);
	});

	dataAsArray.unshift(headers);  // Add headers to the beginning

	this.uploadedFile = new UploadedFile({
	toUpload: false,
	toSaveChanges: false,
	fileName: this.getCurrentDateTime(),
	data: dataAsArray,
	columnSelections: { lat: 6, lng: 7 }, // Update column selections to match the data
	firstRowHeader: false,
	});

	updateUploadedFile(this.uploadedFile);

	// Navigate to the next page, replace 'NextPage' with the actual route name
	this.$router.push({ name: RouteNames.index });

	} catch (error) {
	console.error('Error loading JSON data:', error);
	} finally {
	this.loading = false;
	}
	}




	private pollJsonData(interval: number) {
	this.loadJsonData();
	setInterval(() => {
	this.loadJsonData();
	}, interval);
	}


	protected activated() {
	super.activated();
	this.startClock();
	this.initWebSocket();
	this.loadJsonData();
	}
	}
</script>
