import React from "react";
import RangeSlider from 'react-bootstrap-range-slider';

function DateSlider({ value, onChange, onAfterChange }) {

  const tooltipLabelFormatter = ((value) => {
    const val = parseInt(value)
    if (val === 0) {
      return 'Now'
    } else if (val > 0) {
      if (val === 1) {
        return `${val} Hour from now`
      } else {
        return `${val} Hours from now`
      }
    } else {
      if (val === -1) {
        return `${Math.abs(val)} hour ago`
      } else {
        return `${Math.abs(val)} hours ago`
      }
    }
  })

  return (
    <div className="date-slider">
      <RangeSlider
        value={value}
        onChange={onChange}
        onAfterChange={onAfterChange}
        step={1}
        min={-24}
        max={24}
        tooltip={'auto'}
        tooltipPlacement={'top'}
        tooltipLabel={tooltipLabelFormatter}
        tooltipStyle={{
          'fontFamily': "'Poppins', sans-serif"
        }}
      />
    </div>
  )
}

export default DateSlider;