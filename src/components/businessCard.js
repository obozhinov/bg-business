import React, { Component } from "react"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}))

export default class BusinessCard extends Component {
  items = this.props.data.edges
  classes = useStyles()
  render() {
    return (
      <Card className={classes.card}>
        <CardHeader title={this.items.name} />
        <CardMedia
          className={this.classes.media}
          image={this.items.logoURL}
          title={this.items.name}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {this.items.description}
          </Typography>
        </CardContent>
      </Card>
    )
  }
}
