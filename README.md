Consulting Project for the City of San Diego predicting Graffiti rates

Blog post and interactive map available at katiesch.com/sandiego.html

### Data Processing 

Programs below read and process various data sources. Pull geocoding information, etc. 

Crime Reports 
- crime_reports.ipynb

Code Violations
- code_violations.ipynb

Police Calls 
- police_calls.ipynb
- Did not end up using this in analysis; used Crime Reports instead

Census Information
- process_census.ipynb

311 Reports
- process_requests.ipynb 

Streetlights
- streetlight_density.ipynb

Trees 
- tree_density.ipynb

### Data Exploration 

Used data_exploration.ipynb as a sandbox to explore and play with the combined information from all of the sources listed above. Many of the outdated codes are other sandboxes that evolved into more refined analyses. 

This code also includes a lot of my data visualisation work; output figures saved in output_figures directory. 

### Machine Learning Models 

After exploring a few different modeling options in sandbox codes, used modeling_work.ipynb to optimize and test my linear regression model. Also produced data visualizations in this code; output figures saved in output_figures directory. 

### Interactive visualisation work 

The webwork directoy includes javascript, html, and css used to develop my interactive map of San Diego. The main code is in mapping.js

### Miscellaneous

sdcity_shapefile.ipynb takes the shapefiles of the various blockgroups in San Diego county and whittles it down to the San Diego municipal area. Inputs and outputs are in the shapefiles directory.

data_organiser.ipynb helped me organise my different data sources and their processing. 

big_map.ipynb helped with visualizations, integrating with tiles from Carto and Open Street Map. Outputs are in output_figures directory. 
