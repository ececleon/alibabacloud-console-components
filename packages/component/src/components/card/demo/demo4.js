import React from 'react'
import { Card, Button } from '@alicloud/console-components'

const commonProps = {
  style: { width: 300 },
  title: 'Title',
  extra: <Button text>More</Button>
}

const Demo4 = () => (
	<div>
    <Card {...commonProps} showTitleBullet={false}>
      Card Content
    </Card>
  </div>
)

export default Demo4
