# DataCube
A generator for 3D printable art sculptures. 

## Recommended slicer and printer settings

### Filament

For FDM prints, we recommend PLA, as it works great for bridging (horizontal parts of the prints where no support is underneath). Other filaments that allow bridging should work, too. 

### PrusaSlicer (for FDM printers)

For some of these settings, the _advanced_ or even _expert_ settings mode needs to be selected in PrusaSlicer. 

| Setting | Value | Description  |
| --- | ---  | --- |
| Supports | None | We recommend using the supports that can be optionally generated directly with the model as this will save you some material. Using automatic or manual supports by the slicer should work, too; but it might be difficult to remove.  |
| Layer height (Print Settings -> Layers and perimeters) | 0.3mm | This has been tested with both 0.2 and 0.3 layer height, which worked great.|
| Detect thin walls (Print Settings -> Layers and perimeters) | Yes | This is important for the generated supports to work.  |
| Infill | 0% | The model doesn't really need infill.  |
| Brim | As you like | A brim wasn't required in our tests. But it will help if you are having difficulties keeping the print stuck to the print bed.  |
| Avoid crossing perimeters (Print Settings -> Layers and perimeters) | Optional | Sometimes it happens that the print head movement breaks one of the thin struts while it travels to a different position. This setting should prevent that. However, enabling this can increase the time for G-code generation __a lot__, especially in older versions of Prusa Slicer. Alternatively, you can also enable _Lift Z_, which also prevents the issue. | 
| Lift Z (Printer Settings -> Extruder) | Optional | Helps to avoid breaking thin struts like the previous setting.  |

### Cura (for FDM printers) 

| Setting | Value | Description | 
| --- | --- | --- | 
| Supports | None | see description for PrusaSlicer | 
| Layer height | 0.3mm | see description for PrusaSlicer | 
| Infill | 0% | No infill should be fine. | 
| Brim | As you like | Should work without. Use if the model doesn't stick to the print bed very well. |
| Print Thin Walls | Yes | Important if the supports that come with the model are used as they otherwise don't print. |
| Enable Retraction | Yes | This goes together with the z hop setting. | 
| Z Hop When Retracted | Yes | To avoid breaking the thin struts as the print head travels. | 
